"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PriceHistoryChart } from "@/components/product/price-history-chart"
import { ComparisonTable } from "@/components/product/comparison-table"
import { api, ProductHistory, ProductComparison } from "@/lib/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string

  const [history, setHistory] = useState<ProductHistory | null>(null)
  const [comparison, setComparison] = useState<ProductComparison | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        const [historyData, comparisonData] = await Promise.all([
          api.getProductHistory(id),
          api.getProductComparison(id),
        ])
        setHistory(historyData)
        setComparison(comparisonData)
      } catch (error) {
        console.error("Failed to fetch product data:", error)
        toast.error("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4 pl-0 hover:pl-0 hover:bg-transparent">
              <Link href="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search
              </Link>
            </Button>

            {loading ? (
              <div className="h-10 w-2/3 bg-muted rounded animate-pulse" />
            ) : (
              <h1 className="text-3xl sm:text-4xl font-bold">
                {history?.product_name || "Product Details"}
              </h1>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content - Chart */}
            <div className="lg:col-span-2 space-y-8">
              <PriceHistoryChart
                history={history?.history || []}
                loading={loading}
              />
            </div>

            {/* Sidebar - Comparison */}
            <div className="space-y-8">
              <ComparisonTable
                comparison={comparison?.comparison || []}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
