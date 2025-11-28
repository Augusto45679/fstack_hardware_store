"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar, SearchFilters } from "@/components/search-bar"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductPagination } from "@/components/product/product-pagination"
import { api, GlobalStats, ProductCount, Product } from "@/lib/api"
import { toast } from "sonner"

export default function Home() {
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [count, setCount] = useState<ProductCount | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({ query: "" })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

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
        // Always use search endpoint to handle pagination consistently
        // Even without filters, it returns paginated "all products"
        const response = await api.searchProducts({
          q: searchFilters.query,
          min_price: searchFilters.minPrice,
          max_price: searchFilters.maxPrice,
          store: searchFilters.store,
          sort_by: searchFilters.sortBy,
          page: currentPage,
          limit: 20
        })

        setProducts(response.data)
        setTotalPages(response.total_pages)
        setTotalResults(response.total_results)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        toast.error("Failed to load products")
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [searchFilters, currentPage])

  const handleSearch = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters)
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
                {searchFilters.query || searchFilters.minPrice || searchFilters.maxPrice || searchFilters.store || searchFilters.sortBy ? "Resultados de Búsqueda" : "Todos los Productos"}
              </h2>
              <p className="text-muted-foreground">
                {searchFilters.query
                  ? `Mostrando resultados para "${searchFilters.query}"`
                  : (searchFilters.minPrice || searchFilters.maxPrice || searchFilters.store || searchFilters.sortBy)
                    ? "Mostrando productos filtrados"
                    : "Explora nuestro catálogo completo de componentes de hardware"}
              </p>
            </div>

            <ProductGrid products={products} loading={loadingProducts} />

            {/* Pagination */}
            {!loadingProducts && (
              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
