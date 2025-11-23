export type Category = "gpu" | "cpu" | "monitor" | "ssd" | "ram"

export interface Price {
  store: string
  price: number
  lastUpdated: string
  url: string
}

export interface Product {
  id: string
  name: string
  category: Category
  image: string
  bestPrice: number
  prices: Price[]
  historicData: {
    date: string
    price: number
  }[]
}

export interface CategoryInfo {
  id: Category
  name: string
  title: string
  subtitle: string
  icon: string
}
