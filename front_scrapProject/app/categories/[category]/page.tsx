import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { products, categories } from "@/data/mock-data"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateStaticParams() {
  return categories.map((cat) => ({
    category: cat.id,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params

  const categoryInfo = categories.find((c) => c.id === category)
  const categoryProducts = products.filter((p) => p.category === category)

  if (!categoryInfo) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Category not found</h1>
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
        {/* Category Header */}
        <section className="bg-gradient-to-b from-muted to-background py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
              ← Back to home
            </Link>
            <div className="text-5xl mb-4">{categoryInfo.icon}</div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">{categoryInfo.title}</h1>
            <p className="text-lg text-muted-foreground">{categoryInfo.subtitle}</p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {categoryProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
