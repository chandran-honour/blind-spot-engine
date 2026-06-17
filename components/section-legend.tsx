interface SectionLegendProps {
  title: string
  lines: ReadonlyArray<{ term: string; definition: string }>
}

export function SectionLegend({ title, lines }: SectionLegendProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground leading-relaxed">
      <p className="font-medium text-foreground/70 mb-1.5">{title}</p>
      <dl className="space-y-1">
        {lines.map(({ term, definition }) => (
          <div key={term}>
            <dt className="inline font-medium text-foreground/70">{term}: </dt>
            <dd className="inline">{definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
