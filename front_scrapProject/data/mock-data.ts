import type { Product, CategoryInfo } from "@/lib/types"

export const categories: CategoryInfo[] = [
  {
    id: "gpu",
    name: "GPU",
    title: "Graphics Processing Units",
    subtitle: "Gaming & Professional GPUs",
    icon: "🎮",
  },
  {
    id: "cpu",
    name: "CPU",
    title: "Processors",
    subtitle: "Desktop & Laptop CPUs",
    icon: "⚙️",
  },
  {
    id: "monitor",
    name: "Monitor",
    title: "Displays",
    subtitle: "4K, Gaming & Professional",
    icon: "📺",
  },
  {
    id: "ssd",
    name: "SSD",
    title: "Solid State Drives",
    subtitle: "NVMe & SATA Storage",
    icon: "💾",
  },
  {
    id: "ram",
    name: "RAM",
    title: "Memory",
    subtitle: "DDR4 & DDR5 Memory",
    icon: "🔌",
  },
]

export const products: Product[] = [
  {
    id: "1",
    name: "NVIDIA RTX 4090",
    category: "gpu",
    image: "/graphics-card-nvidia.jpg",
    bestPrice: 1599,
    prices: [
      {
        store: "Best Buy",
        price: 1599.99,
        lastUpdated: "2025-11-22",
        url: "#",
      },
      {
        store: "Newegg",
        price: 1589.99,
        lastUpdated: "2025-11-22",
        url: "#",
      },
      {
        store: "Amazon",
        price: 1609.99,
        lastUpdated: "2025-11-21",
        url: "#",
      },
    ],
    historicData: [
      { date: "2025-11-01", price: 1549 },
      { date: "2025-11-08", price: 1575 },
      { date: "2025-11-15", price: 1599 },
      { date: "2025-11-22", price: 1599 },
    ],
  },
  {
    id: "2",
    name: "Intel Core i9-14900K",
    category: "cpu",
    image: "/cpu-processor-intel.jpg",
    bestPrice: 589,
    prices: [
      { store: "Newegg", price: 589.99, lastUpdated: "2025-11-22", url: "#" },
      { store: "Amazon", price: 599.99, lastUpdated: "2025-11-22", url: "#" },
      { store: "B&H", price: 595.0, lastUpdated: "2025-11-21", url: "#" },
    ],
    historicData: [
      { date: "2025-11-01", price: 699 },
      { date: "2025-11-08", price: 629 },
      { date: "2025-11-15", price: 599 },
      { date: "2025-11-22", price: 589 },
    ],
  },
  {
    id: "3",
    name: 'LG 27" 4K IPS Monitor',
    category: "monitor",
    image: "/monitor-display-4k.jpg",
    bestPrice: 349,
    prices: [
      { store: "Amazon", price: 349.99, lastUpdated: "2025-11-22", url: "#" },
      { store: "Best Buy", price: 379.99, lastUpdated: "2025-11-22", url: "#" },
      { store: "Costco", price: 359.99, lastUpdated: "2025-11-20", url: "#" },
    ],
    historicData: [
      { date: "2025-11-01", price: 399 },
      { date: "2025-11-08", price: 379 },
      { date: "2025-11-15", price: 359 },
      { date: "2025-11-22", price: 349 },
    ],
  },
  {
    id: "4",
    name: "Samsung 990 Pro 2TB NVMe",
    category: "ssd",
    image: "/ssd-storage-nvme.jpg",
    bestPrice: 149,
    prices: [
      { store: "Amazon", price: 149.99, lastUpdated: "2025-11-22", url: "#" },
      { store: "Best Buy", price: 159.99, lastUpdated: "2025-11-22", url: "#" },
      { store: "Newegg", price: 154.99, lastUpdated: "2025-11-21", url: "#" },
    ],
    historicData: [
      { date: "2025-11-01", price: 199 },
      { date: "2025-11-08", price: 179 },
      { date: "2025-11-15", price: 159 },
      { date: "2025-11-22", price: 149 },
    ],
  },
  {
    id: "5",
    name: "Corsair Vengeance DDR5 32GB",
    category: "ram",
    image: "/ram-memory-ddr5.jpg",
    bestPrice: 119,
    prices: [
      { store: "Amazon", price: 119.99, lastUpdated: "2025-11-22", url: "#" },
      { store: "Newegg", price: 124.99, lastUpdated: "2025-11-22", url: "#" },
      { store: "Best Buy", price: 129.99, lastUpdated: "2025-11-21", url: "#" },
    ],
    historicData: [
      { date: "2025-11-01", price: 149 },
      { date: "2025-11-08", price: 139 },
      { date: "2025-11-15", price: 129 },
      { date: "2025-11-22", price: 119 },
    ],
  },
]
