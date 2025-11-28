"use client"

import type React from "react"
import { useState, useEffect } from "react"

export interface SearchFilters {
  query: string
  minPrice?: number
  maxPrice?: number
  store?: string
  sortBy?: string
}

interface SearchBarProps {
  placeholder?: string
  onSearch?: (filters: SearchFilters) => void
}

const STORE_OPTIONS = [
  { value: "", label: "Todas las tiendas" },
  { value: "mercadolibre", label: "MercadoLibre" },
  { value: "compragamer", label: "CompraGamer" },
]

const SORT_OPTIONS = [
  { value: "", label: "Más relevante" },
  { value: "price_asc", label: "Precio: Menor a Mayor" },
  { value: "price_desc", label: "Precio: Mayor a Menor" },
  { value: "date_desc", label: "Más recientes" },
]

export function SearchBar({ placeholder = "Buscar hardware...", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [selectedStore, setSelectedStore] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>({ query: "" })

  // Debounce all filters together
  useEffect(() => {
    const timer = setTimeout(() => {
      const filters: SearchFilters = {
        query,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        store: selectedStore || undefined,
        sortBy: sortBy || undefined,
      }
      setDebouncedFilters(filters)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [query, minPrice, maxPrice, selectedStore, sortBy])

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedFilters)
    }
  }, [debouncedFilters, onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Trigger immediately on submit
    if (onSearch) {
      const filters: SearchFilters = {
        query,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        store: selectedStore || undefined,
        sortBy: sortBy || undefined,
      }
      onSearch(filters)
    }
  }

  const handleClearFilters = () => {
    setMinPrice("")
    setMaxPrice("")
    setSelectedStore("")
    setSortBy("")
  }

  const hasActiveFilters = minPrice || maxPrice || selectedStore || sortBy

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        {/* Main Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-12 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${showFilters || hasActiveFilters
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filtros</span>
              {hasActiveFilters && (
                <span className="bg-background text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {[minPrice, maxPrice, selectedStore, sortBy].filter(Boolean).length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-lg p-4 space-y-4 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">Filtros Avanzados</h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Precio Mínimo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full pl-7 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Precio Máximo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Sin límite"
                    min="0"
                    className="w-full pl-7 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Store Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tienda</label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {STORE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
