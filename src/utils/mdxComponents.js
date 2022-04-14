export const mdxComponents = {
  img: (props) => (
    <div className="relative not-prose my-[2em] first:mt-0 last:mb-0 rounded-lg overflow-hidden">
      <img {...props} />
      <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-slate-900/10" />
    </div>
  ),
}
