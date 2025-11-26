import Link from "next/link"
import type { Product } from "@/lib/api"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.product_id}`}>
      <div className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Product Image Placeholder */}
        <div className="relative w-full h-48 bg-muted overflow-hidden flex items-center justify-center">
          <span className="text-4xl">🖥️</span>
        </div>

        {/* Product Info */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.product_name}
          </h3>

          {/* Price */}
          <div className="mt-auto mb-4">
            <div className="text-2xl font-bold text-primary">${product.price}</div>
            <div className="text-xs text-muted-foreground">in {product.store}</div>
          </div>

          {/* View History Button */}
          <button className="w-full py-2 px-3 bg-primary text-primary-foreground rounded text-sm font-medium hover:opacity-90 transition-opacity">
            View details
          </button>
        </div>
      </div>
    </Link>
  )
}
