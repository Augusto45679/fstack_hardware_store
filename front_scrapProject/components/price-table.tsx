import type { Price } from "@/lib/types"

interface PriceTableProps {
  prices: Price[]
}

export function PriceTable({ prices }: PriceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">Store</th>
            <th className="text-right py-3 px-4 font-semibold">Price</th>
            <th className="text-left py-3 px-4 font-semibold">Last Updated</th>
            <th className="text-center py-3 px-4 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price, idx) => (
            <tr key={idx} className="border-b border-border hover:bg-muted transition-colors">
              <td className="py-3 px-4 font-medium">{price.store}</td>
              <td className="text-right py-3 px-4 font-semibold text-primary">${price.price.toFixed(2)}</td>
              <td className="py-3 px-4 text-muted-foreground">{price.lastUpdated}</td>
              <td className="py-3 px-4 text-center">
                <a
                  href={price.url}
                  className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Go to store
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
