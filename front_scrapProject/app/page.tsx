"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { ProductGrid } from "@/components/product/product-grid"
import { api, GlobalStats, ProductCount, Product } from "@/lib/api"
import { toast } from "sonner"

export default function Home() {
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [count, setCount] = useState<ProductCount | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsData, countData] = await Promise.all([
          api.getGlobalStats(),
          api.getProductCount(),
        ])
        setStats(statsData)
        setCount(countData)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        toast.error("Failed to load dashboard statistics")
      } finally {
        setLoadingStats(false)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true)
      try {
        if (searchQuery) {
          const response = await api.searchProducts({ q: searchQuery, limit: 20 })
          setProducts(response.data)
        } else {
          // If no search query, fetch all (or a default set)
          const data = await api.getAllProducts()
          setProducts(data)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
        toast.error("Failed to load products")
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-muted to-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-balance">
                Compare hardware prices <span className="text-primary">instantly</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
                Track price history of GPUs, CPUs, monitors, SSDs and more across your favorite retailers.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* KPI Cards */}
            <div className="mt-8">
              <KPICards stats={stats} count={count} loading={loadingStats} />
            </div>
          </div>
        </section>

        {/* Product List Section */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {searchQuery ? "Search Results" : "All Products"}
              </h2>
              <p className="text-muted-foreground">
                {searchQuery
                  ? `Showing results for "${searchQuery}"`
                  : "Browse our complete catalog of hardware components"}
              </p>
            </div>

            <ProductGrid products={products} loading={loadingProducts} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
