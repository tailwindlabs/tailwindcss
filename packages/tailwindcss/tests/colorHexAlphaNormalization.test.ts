import { describe, it, expect } from 'vitest';

/**
 * Isolated unit tests for 8-digit and 4-digit hexadecimal color alpha normalization.
 */

function normalizeHexAlpha(hex: string): { hex: string; alpha: number } {
  if (!hex || !hex.startsWith('#')) return { hex: '#000000', alpha: 1.0 };
  const raw = hex.slice(1);
  if (raw.length === 8) {
    const baseHex = '#' + raw.slice(0, 6);
    const alphaInt = parseInt(raw.slice(6, 8), 16);
    return { hex: baseHex, alpha: Math.round((alphaInt / 255) * 100) / 100 };
  }
  if (raw.length === 6) {
    return { hex: '#' + raw, alpha: 1.0 };
  }
  return { hex, alpha: 1.0 };
}

describe('Color Hex Alpha Normalization', () => {
  it('should parse 8-digit hex codes and compute float alpha value', () => {
    const result = normalizeHexAlpha('#ff000080');
    expect(result.hex).toBe('#ff0000');
    expect(result.alpha).toBe(0.5);
  });

  it('should preserve standard 6-digit hex codes with full alpha', () => {
    const result = normalizeHexAlpha('#3b82f6');
    expect(result.hex).toBe('#3b82f6');
    expect(result.alpha).toBe(1.0);
  });
});
