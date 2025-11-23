"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { CategoryCard } from "@/components/category-card"
import { categories } from "@/data/mock-data"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // TODO: Implement search functionality
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-muted to-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
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

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary">50K+</div>
                <p className="text-sm text-muted-foreground">Products tracked</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100+</div>
                <p className="text-sm text-muted-foreground">Retailers</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">2yr</div>
                <p className="text-sm text-muted-foreground">Price history</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Categories</h2>
              <p className="text-lg text-muted-foreground">Browse the most popular hardware categories</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  icon={category.icon}
                  title={category.name}
                  subtitle={category.subtitle}
                  href={`/categories/${category.id}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-24 bg-muted">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">Get started in three simple steps</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: "Choose a Product",
                  description: "Browse or search for any hardware component you are interested in.",
                  icon: "🔍",
                },
                {
                  step: 2,
                  title: "Compare Prices",
                  description: "See real-time prices from multiple retailers in one place.",
                  icon: "⚖️",
                },
                {
                  step: 3,
                  title: "See Historic Data",
                  description: "Track price trends over time to find the best deals.",
                  icon: "📈",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-colors"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-lg font-semibold mb-2">{item.title}</div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
