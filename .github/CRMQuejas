import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Download, Upload, Trash2, Pencil, Filter, RefreshCw, X, FileSpreadsheet, CheckCircle2, AlertTriangle, LockKeyhole, ShieldCheck, LogOut, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import saveAs from "file-saver"; // import default para compatibilidad +esm
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

/**
 * CRM – Quejas Redes (Roles: MASTER y AGENTE)
 * - Importa XLSX/CSV (hoja "Data").
 * - Filtros, métricas, gráfica y tabla.
 * - CRUD para MASTER; AGENTE solo cambia "Estatus" (auto fecha de solución).
 * - Persistencia local.
 */

const STORAGE_KEY = "crm_quejas_redes_v3";
const PINS_KEY = "crm_quejas_redes_pins_v1";
const ROLE_MASTER = "MASTER";
const ROLE_AGENT = "AGENTE";
const RUN_TESTS = true;

type CatalogOptions = Record<string, string[]>; // Catálogos (desde hoja NOM)
const ALL = "__ALL__"; // valor centinela

const DEFAULT_COLUMNS = [
  "Fecha de contacto",
  "Dias transcurridos",
  "Canal de Contacto",
  "Número de Pedido",
  "Fecha de liquidación",
  "Fecha de Entrega",
  "Motivo de Queja",
  "Departamento",
  "Sucursal",
  "Ejecutivo",
  "Encargado",
  "Procedente / Improcedente",
  "Observaciones",
  "Estatus",
  "Fecha Canalizo",
  "Fecha de solucion",
  "Comentarios-Escritorio",
  "Proveedor",
];

function parseDate(value: any) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}
function daysBetween(a: any, b: any) {
  const da = parseDate(a);
  const db = parseDate(b);
  if (!da || !db) return null;
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

// === Fechas Excel → dd/mm/aaaa ===
function excelSerialToDateString(n: number) {
  const base = new Date(Date.UTC(1899, 11, 30));
  const d = new Date(base.getTime() + n * 24 * 60 * 60 * 1000);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yy = d.getUTCFullYear();
  return `${dd}/${mm}/${yy}`;
}
function looksLikeExcelDate(val: any) {
  return typeof val === "number" && val > 20000 && val < 60000;
}
function isDateColumn(name: string) {
  return /^fecha/i.test(name.trim());
}

function csvFromArray(objects: any[], columns: string[]) {
  const header = columns.join(",");
  const rows = objects.map((obj) =>
    columns
      .map((c) => {
        const v = obj?.[c] ?? "";
        const s = typeof v === "string" ? v.replaceAll('"', '""') : v;
        return `"${s ?? ""}"`;
      })
      .join(",")
  );
  return [header, ...rows].join("\n");
}

function toXlsxBlob(data: any[], columns: string[], sheetName = "Data") {
  const ws = XLSX.utils.json_to_sheet(data, { header: columns });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([wbout], { type: "application/octet-stream" });
}

// Construye catálogos desde hoja 2 (NOM)
function catalogsFromSheet2(sheet: XLSX.WorkSheet | undefined): CatalogOptions {
  if (!sheet) return {};
  const raw = XLSX.utils.sheet_to_json<any>(sheet, { defval: "" });
  const cols = new Map<string, Set<string>>();
  raw.forEach((row) => {
    Object.keys(row).forEach((k) => {
      const val = String(row[k] ?? "").trim();
      if (!val) return;
      if (!cols.has(k)) cols.set(k, new Set());
      cols.get(k)!.add(val);
    });
  });
  const out: CatalogOptions = {};
  cols.forEach((set, key) => (out[key] = Array.from(set.values())));
  return out;
}

// Mapea encabezados de NOM (flexible) -> columnas esperadas por la app
function mapNomToTargets(source: CatalogOptions): CatalogOptions {
  const norm = (s: string) =>
    s.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const targets = [
    "Sucursal",
    "Departamento",
    "Encargado",
    "Motivo de Queja",
    "Estatus",
    "Procedente / Improcedente",
    "Canal de Contacto",
    "Proveedor",
  ] as const;

  const tests: Record<typeof targets[number], ((h: string) => boolean)[]> = {
    Sucursal: [(h) => norm(h).includes("sucursal")],
    Departamento: [(h) => norm(h).includes("area") || norm(h).includes("departamento")],
    Encargado: [(h) => norm(h).includes("encargado")],
    "Motivo de Queja": [(h) => norm(h).includes("motivo")],
    Estatus: [(h) => norm(h).includes("estatus") || norm(h).includes("status")],
    "Procedente / Improcedente": [(h) => norm(h).includes("procedente") || norm(h).includes("improcedente")],
    "Canal de Contacto": [(h) => norm(h).includes("canal")],
    Proveedor: [(h) => norm(h).includes("proveedor")],
  };

  const result: CatalogOptions = {};
  targets.forEach((t) => (result[t] = []));

  Object.entries(source).forEach(([header, values]) => {
    const matches = Object.entries(tests).filter(([, fns]) => fns.some((fn) => fn(header)));
    if (!matches.length) return;
    matches.forEach(([target]) => {
      const list = values.filter((v) => String(v).trim() !== "");
      result[target] = Array.from(new Set([...(result[target] || []), ...list]));
    });
  });

  Object.keys(result).forEach((k) => {
    if (!result[k]?.length) { delete result[k]; return; }
    result[k] = Array.from(new Set(result[k]!)).sort((a, b) => a.localeCompare(b as string, "es"));
  });

  return result;
}

function useLocalStorageState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

function uuid() {
  try { return crypto.randomUUID(); } catch { return `${Date.now()}_${Math.floor(Math.random() * 1e6)}`; }
}

function LogoDEurope() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-amber-400 shadow" />
      <div className="font-semibold tracking-wide">D’Europe Muebles – CRM Quejas</div>
    </div>
  );
}

function RoleBadge({ role, onLogout, onOpenPins }: { role: string | null; onLogout: () => void; onOpenPins: () => void }) {
  const isMaster = role === ROLE_MASTER;
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant={isMaster ? "default" : "secondary"} className="gap-2 rounded-2xl">
        {isMaster ? <ShieldCheck className="w-4 h-4" /> : <LockKeyhole className="w-4 h-4" />}
        {role}
      </Button>
      <Button size="icon" variant="ghost" title="Configurar PINes" onClick={onOpenPins}><KeyRound className="w-4 h-4" /></Button>
      <Button size="icon" variant="ghost" title="Salir" onClick={onLogout}><LogOut className="w-4 h-4" /></Button>
    </div>
  );
}

function LoginDialog({ open, onOpenChange, onLogin }: { open: boolean; onOpenChange: (v: boolean) => void; onLogin: (role: string, pin: string) => void }) {
  const [role, setRole] = useState(ROLE_AGENT);
  const [pin, setPin] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Entrar</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Rol</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full bg-white text-slate-900 border-slate-300"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ROLE_AGENT}>AGENTE (solo estatus)</SelectItem>
                <SelectItem value={ROLE_MASTER}>MASTER (completo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">PIN</Label>
            <Input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="****" />
          </div>
        </div>
        <DialogFooter><Button onClick={() => onLogin(role, pin)}>Entrar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PinsDialog({ open, onOpenChange, pins, setPins }: { open: boolean; onOpenChange: (v: boolean) => void; pins: any; setPins: (v: any) => void }) {
  const [form, setForm] = useState(pins);
  useEffect(() => setForm(pins), [pins]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Configurar PINes</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 gap-3">
          <div><Label className="text-xs">PIN MASTER</Label><Input type="password" value={form.master} onChange={(e) => setForm((f: any) => ({ ...f, master: e.target.value }))} /></div>
          <div><Label className="text-xs">PIN AGENTE</Label><Input type="password" value={form.agent} onChange={(e) => setForm((f: any) => ({ ...f, agent: e.target.value }))} /></div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button onClick={() => { setPins(form); onOpenChange(false); toast.success("PINes guardados"); }}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Filters({
  filters, setFilters, statuses, procedencias, departamentos,
}: { filters: any; setFilters: (v: any) => void; statuses: string[]; procedencias: string[]; departamentos: string[]; }) {
  return (
    <div className="grid md:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-3">
      <div className="col-span-2 flex items-center gap-2">
        <Search className="w-4 h-4" />
        <Input placeholder="Buscar en pedido, motivo, sucursal, comentarios…" value={filters.q} onChange={(e) => setFilters((f: any) => ({ ...f, q: e.target.value }))} />
      </div>
      <div>
        <Label className="text-xs">Estatus</Label>
        <Select value={filters.status} onValueChange={(v) => setFilters((f: any) => ({ ...f, status: v }))}>
          <SelectTrigger className="w-full bg-white text-slate-900 border-slate-300"><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {statuses.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs">Procedencia</Label>
        <Select value={filters.proc} onValueChange={(v) => setFilters((f: any) => ({ ...f, proc: v }))}>
          <SelectTrigger className="w-full bg-white text-slate-900 border-slate-300"><SelectValue placeholder="Todas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas</SelectItem>
            {procedencias.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs">Departamento</Label>
        <Select value={filters.depto} onValueChange={(v) => setFilters((f: any) => ({ ...f, depto: v }))}>
          <SelectTrigger className="w-full bg-white text-slate-900 border-slate-300"><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {departamentos.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function EditDialog({ open, onOpenChange, columns, initial, onSave, catalogs }: { open: boolean; onOpenChange: (v: boolean) => void; columns: string[]; initial: any; onSave: (v: any) => void; catalogs: CatalogOptions }) {
  const [form, setForm] = useState(initial || {});
  useEffect(() => setForm(initial || {}), [initial]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle className="text-xl">{initial?.__id ? "Editar registro" : "Nuevo registro"}</DialogTitle></DialogHeader>
        <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-auto pr-1">
          {columns.map((c) => (
            <div key={c} className="space-y-1">
              <Label className="text-xs">{c}</Label>
              {catalogs[c] && catalogs[c].length ? (
                <Select value={form[c] ?? undefined} onValueChange={(v) => setForm((f: any) => ({ ...f, [c]: v }))}>
                  <SelectTrigger className="w-full bg-white text-slate-900 border-slate-300"><SelectValue placeholder={`Selecciona ${c}`} /></SelectTrigger>
                  <SelectContent>
                    {catalogs[c].map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                  </SelectContent>
                </Select>
              ) : (
                <Input className="bg-white text-slate-900 border-slate-300" value={form[c] ?? ""} onChange={(e) => setForm((f: any) => ({ ...f, [c]: e.target.value }))} placeholder={c} />
              )}
            </div>
          ))}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => onSave(form)}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatusDialog({ open, onOpenChange, row, onSaveStatus, allowedStatuses }: { open: boolean; onOpenChange: (v: boolean) => void; row: any; onSaveStatus: (v: { status: string; coment: string }) => void; allowedStatuses: string[] }) {
  const [status, setStatus] = useState("");
  const [coment, setComent] = useState("");
  useEffect(() => { setStatus(row?.["Estatus"] ?? ""); setComent(""); }, [row]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Actualizar estatus</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Estatus</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full bg-white text-slate-900 border-slate-300"><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                {allowedStatuses.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
            <p className="text-xs text-zinc-500 mt-1">Si eliges "Resuelto" o "Cerrado" se pondrá hoy en "Fecha de solucion".</p>
          </div>
          <div>
            <Label className="text-xs">Comentario</Label>
            <Input value={coment} onChange={(e) => setComent(e.target.value)} placeholder="Opcional" />
          </div>
        </div>
        <DialogFooter><Button onClick={() => onSaveStatus({ status, coment })}>Guardar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [columns, setColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [rows, setRows] = useLocalStorageState<any[]>(STORAGE_KEY, []);
  const [catalogs, setCatalogs] = useState<CatalogOptions>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({ q: "", status: ALL, proc: ALL, depto: ALL });
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const [role, setRole] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(true);
  const [pins, setPins] = useLocalStorageState(PINS_KEY, { master: "2468", agent: "1357" });
  const [pinsOpen, setPinsOpen] = useState(false);

  const isMaster = role === ROLE_MASTER;

  function handleLogin(selRole: string, pin: string) {
    const ok = selRole === ROLE_MASTER ? pin === pins.master : pin === pins.agent;
    if (!ok) { toast.error("PIN incorrecto"); return; }
    setRole(selRole); setLoginOpen(false); toast.success(`Sesión iniciada como ${selRole}`);
  }
  function handleLogout() { setRole(null); setLoginOpen(true); }

  const statuses = useMemo(() => Array.from(new Set(rows.map((r) => (r["Estatus"] ?? "").toString().trim()).filter(Boolean))).sort(), [rows]);
  const procedencias = useMemo(() => Array.from(new Set(rows.map((r) => (r["Procedente / Improcedente"] ?? "").toString().trim()).filter(Boolean))).sort(), [rows]);
  const departamentos = useMemo(() => Array.from(new Set(rows.map((r) => (r["Departamento"] ?? "").toString().trim()).filter(Boolean))).sort(), [rows]);

  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase();
    return rows.filter((r) => {
      if (filters.status !== ALL && (r["Estatus"] ?? "") !== filters.status) return false;
      if (filters.proc !== ALL && (r["Procedente / Improcedente"] ?? "") !== filters.proc) return false;
      if (filters.depto !== ALL && (r["Departamento"] ?? "") !== filters.depto) return false;
      if (!q) return true;
      const hay = [r["Número de Pedido"], r["Motivo de Queja"], r["Sucursal"], r["Comentarios-Escritorio"], r["Observaciones"], r["Ejecutivo"], r["Encargado"], r["Proveedor"], r["Canal de Contacto"]].map((v) => (v ?? "").toString().toLowerCase());
      return hay.some((s) => s.includes(q));
    });
  }, [rows, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);

  const metrics = useMemo(() => {
    const total = filtered.length;
    const proc = filtered.filter((r) => (r["Procedente / Improcedente"] ?? "").toString().toLowerCase().includes("procedente")).length;
    const improc = filtered.filter((r) => (r["Procedente / Improcedente"] ?? "").toString().toLowerCase().includes("improcedente")).length;
    const cerrados = filtered.filter((r) => (r["Estatus"] ?? "").toString().toLowerCase().includes("cerr") || (r["Estatus"] ?? "").toString().toLowerCase().includes("resuelto")).length;
    const abiertos = total - cerrados;
    const diffs = filtered.map((r) => daysBetween(r["Fecha de contacto"], r["Fecha de solucion"])) as (number | null)[];
    const nums = diffs.filter((v): v is number => typeof v === "number");
    const tprom = nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : null;
    return { total, proc, improc, abiertos, cerrados, tprom };
  }, [filtered]);

  const chartData = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach((r) => { const key = r["Departamento"] || "(Sin depto)"; m.set(key, (m.get(key) || 0) + 1); });
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  function importExcel(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array((e.target as any).result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const dataSheet = wb.Sheets["Data"] || wb.Sheets[wb.SheetNames[0]];
        const sheet2 = wb.Sheets["NOM"] || wb.Sheets[wb.SheetNames[1]]; // catálogos
        const json: any[] = XLSX.utils.sheet_to_json(dataSheet, { defval: "" });
        const cols = DEFAULT_COLUMNS.filter((c) => json.some((r) => Object.prototype.hasOwnProperty.call(r, c)));
        const finalCols = cols.length ? cols : Array.from(new Set(json.flatMap((r) => Object.keys(r))));
        const withIds = json.map((r) => {
          const fixed: any = { ...r };
          Object.keys(fixed).forEach((k) => { if (isDateColumn(k) && looksLikeExcelDate(fixed[k])) fixed[k] = excelSerialToDateString(fixed[k]); });
          return { __id: uuid(), ...fixed };
        });
        setColumns(finalCols); setRows(withIds); setPage(1);
        const cats = mapNomToTargets(catalogsFromSheet2(sheet2)); setCatalogs(cats);
        toast.success(`Importados ${withIds.length} registros${Object.keys(cats).length ? " + catálogos" : ""}`);
      } catch (err) {
        console.error(err); toast.error("No se pudo leer el archivo. Sube un XLSX/CSV válido.");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function exportCSV() { const csv = csvFromArray(filtered, columns); const blob = new Blob([csv], { type: "text/csv;charset=utf-8" }); saveAs(blob, `CRM_Quejas_Export_${new Date().toISOString().slice(0, 10)}.csv`); }
  function exportXLSX() { const blob = toXlsxBlob(filtered, columns, "Data"); saveAs(blob, `CRM_Quejas_Export_${new Date().toISOString().slice(0, 10)}.xlsx`); }

  function onSaveRecord(form: any) {
    const clean: any = { __id: form.__id || uuid() };
    columns.forEach((c) => { if (form[c] !== undefined && String(form[c]).trim() !== "") clean[c] = form[c]; });
    if (!form.__id) { setRows((prev) => [clean, ...prev]); toast.success("Registro agregado"); }
    else { setRows((prev) => prev.map((r) => (r.__id === form.__id ? { ...r, ...clean } : r))); toast.success("Registro actualizado"); }
    // mantener catálogos actualizados
    setCatalogs((prev) => {
      const next = { ...prev } as CatalogOptions;
      Object.keys(clean).forEach((k) => { if (!next[k]) return; const val = String(clean[k]); if (val && !next[k].includes(val)) next[k] = [...next[k], val]; });
      return next;
    });
    setEditOpen(false);
  }

  function onDelete(id: string) { setRows((prev) => prev.filter((r) => r.__id !== id)); toast.message("Registro eliminado", { description: id }); }
  function clearAll() { setRows([]); toast("Base vaciada (solo local)"); }

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusRow, setStatusRow] = useState<any | null>(null);
  const baseAllowed = useMemo(() => { const pre = new Set(["Resuelto", "No resuelto", "Cerrado", "Abierto", "En proceso"]); statuses.forEach((s) => pre.add(s)); return Array.from(pre); }, [statuses]);

  function saveStatus({ status, coment }: { status: string; coment: string }) {
    if (!statusRow) return;
    const cerr = (status || "").toLowerCase();
    const resolved = cerr.includes("cerr") || cerr.includes("resuelto");
    const hoy = new Date();
    setRows((prev) => prev.map((r) => {
      if (r.__id !== statusRow.__id) return r;
      const out: any = { ...r, Estatus: status };
      if (resolved) out["Fecha de solucion"] = hoy.toISOString().slice(0, 10);
      if (coment) {
        const prevTxt = (r["Comentarios-Escritorio"] || "").toString();
        const sep = prevTxt ? " \n" : "";
        out["Comentarios-Escritorio"] = `${prevTxt}${sep}[${hoy.toISOString().slice(0, 16).replace("T", " ")}] ${coment}`;
      }
      return out;
    }));
    setStatusOpen(false); toast.success("Estatus actualizado");
  }

  // Pruebas ligeras
  useEffect(() => {
    if (!RUN_TESTS) return;
    try {
      const cols = ["A", "B"]; const data = [{ A: 1, B: "x" }, { A: 2, B: "y" }];
      const csv = csvFromArray(data, cols);
      console.assert(csv.split("\n").length === 3, "csvFromArray debe tener 3 líneas");
      console.assert(csv.startsWith("A,B\n"), "Header incorrecto");
      console.assert(daysBetween("2024-01-01", "2024-01-11") === 10, "daysBetween incorrecto");
      const csv2 = csvFromArray([{ A: 'He said "hola"', B: 'a,b' } as any], cols);
      console.assert(csv2.includes('\"He said \"\"hola\"\"\"'), "escape comillas CSV");
      console.assert(ALL !== "", "ALL no debe ser vacío");
      console.assert(excelSerialToDateString(45926) === "13/10/2025", "Excel serial → fecha");
    } catch (e) { console.warn("Pruebas fallaron", e); }
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <LogoDEurope />
          <div className="flex items-center gap-2">
            {isMaster && (
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer border border-slate-300">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Importar Excel</span>
                <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => e.target.files?.[0] && importExcel(e.target.files[0])} />
              </label>
            )}
            <Button variant="secondary" onClick={exportCSV} className="gap-2"><Download className="w-4 h-4" /> CSV</Button>
            <Button variant="secondary" onClick={exportXLSX} className="gap-2"><FileSpreadsheet className="w-4 h-4" /> XLSX</Button>
            {isMaster && (
              <Button onClick={() => { setEditing(null); setEditOpen(true); }} className="gap-2">
                <Plus className="w-4 h-4" /> Nuevo
              </Button>
            )}
            {role ? <RoleBadge role={role} onLogout={handleLogout} onOpenPins={() => setPinsOpen(true)} /> : null}
          </div>
        </div>

        {/* Dashboard */}
        <div className="grid md:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm">Total registros</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{metrics.total}</CardContent></Card>
          <Card className="bg-white border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm">Procedentes</CardTitle></CardHeader><CardContent className="text-3xl font-bold flex items-center gap-2"><CheckCircle2 className="w-6 h-6" />{metrics.proc}</CardContent></Card>
          <Card className="bg-white border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm">Improcedentes</CardTitle></CardHeader><CardContent className="text-3xl font-bold flex items-center gap-2"><AlertTriangle className="w-6 h-6" />{metrics.improc}</CardContent></Card>
          <Card className="bg-white border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm">Abiertos</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{metrics.abiertos}</CardContent></Card>
          <Card className="bg-white border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm">T. prom. resolución (días)</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{metrics.tprom ?? "—"}</CardContent></Card>
        </div>

        {/* Filtros */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Filter className="w-4 h-4" /> Filtros</CardTitle>
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => setFilters({ q: "", status: ALL, proc: ALL, depto: ALL })}><RefreshCw className="w-4 h-4" /> Limpiar</Button>
          </CardHeader>
          <CardContent>
            <Filters filters={filters} setFilters={setFilters} statuses={statuses} procedencias={procedencias} departamentos={departamentos} />
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base">Registros por Departamento</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Registros</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                <SelectTrigger className="w-28 bg-white text-slate-900 border-slate-300"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100, filtered.length || 1].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n === (filtered.length || 1) ? "Todos" : `${n}/página`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isMaster && (<Button variant="destructive" className="gap-2" onClick={clearAll}><Trash2 className="w-4 h-4" /> Vaciar</Button>)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left">Acciones</th>
                    {columns.map((c) => (<th key={c} className="px-3 py-2 text-left font-medium whitespace-nowrap">{c}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((r) => (
                    <tr key={r.__id} className="odd:bg-slate-50 hover:bg-slate-100">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isMaster ? (
                            <>
                              <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setEditOpen(true); }} title="Editar"><Pencil className="w-4 h-4" /></Button>
                              <Button size="icon" variant="ghost" onClick={() => onDelete(r.__id)} title="Eliminar"><X className="w-4 h-4" /></Button>
                            </>
                          ) : (
                            <Button size="sm" variant="secondary" onClick={() => { setStatusRow(r); setStatusOpen(true); }} title="Actualizar estatus">Estatus</Button>
                          )}
                        </div>
                      </td>
                      {columns.map((c) => {
                        const raw = r[c];
                        const display = isDateColumn(c) && looksLikeExcelDate(raw) ? excelSerialToDateString(raw) : String(raw ?? "");
                        return (<td key={c} className="px-3 py-2 whitespace-nowrap max-w-[280px] truncate" title={display}>{display}</td>);
                      })}
                    </tr>
                  ))}
                  {pageData.length === 0 && (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-center py-10 text-zinc-400">Sin datos. {isMaster ? "Importa un Excel o agrega un nuevo registro." : "Pide a un MASTER que cargue datos."}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-slate-500">Mostrando {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} de {filtered.length}</div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} /></PaginationItem>
                  {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
                    const num = i + 1;
                    return (<PaginationItem key={num}><PaginationLink href="#" isActive={page === num} onClick={(e) => { e.preventDefault(); setPage(num); }}>{num}</PaginationLink></PaginationItem>);
                  })}
                  <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} /></PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        {/* Modales */}
        <EditDialog open={editOpen} onOpenChange={setEditOpen} columns={columns} initial={editing} onSave={onSaveRecord} catalogs={catalogs} />
        <StatusDialog open={statusOpen} onOpenChange={setStatusOpen} row={statusRow} onSaveStatus={saveStatus} allowedStatuses={baseAllowed} />
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} onLogin={handleLogin} />
        <PinsDialog open={pinsOpen} onOpenChange={setPinsOpen} pins={pins} setPins={setPins} />

        <div className="text-xs text-slate-500 text-center py-6">Cambios guardados en tu navegador. Usa Exportar para compartir.</div>
      </div>
    </div>
  );
}
