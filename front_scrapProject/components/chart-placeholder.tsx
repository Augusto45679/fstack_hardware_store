interface ChartPlaceholderProps {
  title?: string
  height?: number
}

export function ChartPlaceholder({ title = "Price History", height = 300 }: ChartPlaceholderProps) {
  return (
    <div
      style={{ height: `${height}px` }}
      className="bg-muted rounded-lg border border-border flex items-center justify-center flex-col gap-4"
    >
      <div className="text-5xl">📊</div>
      <div className="text-center">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">Chart component will be integrated here</p>
      </div>
    </div>
  )
}
