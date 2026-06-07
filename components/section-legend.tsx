interface SectionLegendProps {
  title: string
  lines: { term: string; definition: string }[]
}

export function SectionLegend({ title, lines }: SectionLegendProps) {
  return (
    <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 px-3 py-2.5 text-xs text-slate-400 leading-relaxed">
      <p className="font-medium text-slate-500 mb-1.5">{title}</p>
      <dl className="space-y-1">
        {lines.map(({ term, definition }) => (
          <div key={term}>
            <dt className="inline font-medium text-slate-500">{term}: </dt>
            <dd className="inline text-slate-400">{definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
