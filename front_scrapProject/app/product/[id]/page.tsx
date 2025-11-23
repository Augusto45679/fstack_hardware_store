import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PriceTable } from "@/components/price-table"
import { ChartPlaceholder } from "@/components/chart-placeholder"
import { products, categories } from "@/data/mock-data"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  const product = products.find((p) => p.id === id)
  const category = categories.find((c) => c.id === product?.category)

  if (!product || !category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Product not found</h1>
            <Link href="/" className="text-primary hover:underline">
              Back to home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-muted/50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Home
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link href={`/categories/${category.id}`} className="text-muted-foreground hover:text-primary">
                {category.name}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Product Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Product Image */}
            <div className="md:col-span-1">
              <div className="w-full bg-muted rounded-lg overflow-hidden">
                <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-auto" />
              </div>
            </div>

            {/* Product Info */}
            <div className="md:col-span-2">
              <div className="mb-2">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {category.name}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              {/* Price Section */}
              <div className="mb-8 p-6 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Best current price</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-5xl font-bold text-primary">${product.bestPrice}</div>
                  <div className="text-lg text-muted-foreground">USD</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 border-b border-border mb-6">
                <button className="px-4 py-3 font-medium border-b-2 border-primary text-primary">Overview</button>
                <button className="px-4 py-3 font-medium text-muted-foreground hover:text-foreground">History</button>
                <button className="px-4 py-3 font-medium text-muted-foreground hover:text-foreground">Stores</button>
              </div>
            </div>
          </div>

          {/* Price Comparison Table */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Price Comparison</h2>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <PriceTable prices={product.prices} />
            </div>
          </div>

          {/* Historic Price Chart */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Historic Price Chart</h2>
            <ChartPlaceholder title="30-Day Price History" height={400} />
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted rounded-lg p-6">
              <h3 className="font-semibold mb-4">Price Trend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">30-day change</span>
                  <span className="text-green-600 font-medium">-$50 (-7.8%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">90-day change</span>
                  <span className="text-green-600 font-medium">-$100 (-13.5%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">All-time low</span>
                  <span className="font-medium">${product.bestPrice}</span>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-6">
              <h3 className="font-semibold mb-4">Top Retailers</h3>
              <div className="space-y-2 text-sm">
                {product.prices.slice(0, 3).map((price, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>{price.store}</span>
                    <span className="font-medium">${price.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
