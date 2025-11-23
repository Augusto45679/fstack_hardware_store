import Link from "next/link"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative w-full h-48 bg-muted overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-auto mb-4">
            <div className="text-2xl font-bold text-primary">${product.bestPrice}</div>
            <div className="text-xs text-muted-foreground">Best price</div>
          </div>

          {/* Sparkline Placeholder */}
          <div className="mb-4 h-8 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
            Chart preview
          </div>

          {/* View History Button */}
          <button className="w-full py-2 px-3 bg-primary text-primary-foreground rounded text-sm font-medium hover:opacity-90 transition-opacity">
            View history
          </button>
        </div>
      </div>
    </Link>
  )
}
