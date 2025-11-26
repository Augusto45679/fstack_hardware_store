

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- Interfaces ---

export interface Product {
    product_id: string;
    product_name: string;
    price: number;
    store: string;
    link: string;
    date?: string;
}

export interface PriceHistoryItem {
    date: string;
    price: number;
    store: string;
}

export interface ProductHistory {
    product_id: string;
    product_name: string;
    history: PriceHistoryItem[];
}

export interface ProductComparisonItem {
    store: string;
    price: number;
    link: string;
}

export interface ProductComparison {
    product_id: string;
    product_name: string;
    comparison: ProductComparisonItem[];
}

export interface BestPriceProduct {
    product_name: string;
    min_price: number;
    store: string;
}

export interface GlobalStats {
    best_prices: BestPriceProduct[];
}

export interface ProductSearchResponse {
    total_results: number;
    total_pages: number;
    current_page: number;
    limit: number;
    data: Product[];
}

export interface ProductCount {
    total_products: number;
}

// --- API Client ---

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, options);

    if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export const api = {
    getGlobalStats: () => fetchJson<GlobalStats>("/products/stats"),

    getProductCount: () => fetchJson<ProductCount>("/products/count"),

    getAllProducts: () => fetchJson<Product[]>("/products/"),

    searchProducts: (params: {
        q?: string;
        min_price?: number;
        max_price?: number;
        store?: string;
        sort_by?: string;
        page?: number;
        limit?: number;
    }) => {
        const searchParams = new URLSearchParams();
        if (params.q) searchParams.append("q", params.q);
        if (params.min_price) searchParams.append("min_price", params.min_price.toString());
        if (params.max_price) searchParams.append("max_price", params.max_price.toString());
        if (params.store) searchParams.append("store", params.store);
        if (params.sort_by) searchParams.append("sort_by", params.sort_by);
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());

        return fetchJson<ProductSearchResponse>(`/products/search?${searchParams.toString()}`);
    },

    getProductHistory: (productId: string) =>
        fetchJson<ProductHistory>(`/products/${productId}/history`),

    getProductComparison: (productId: string) =>
        fetchJson<ProductComparison>(`/products/${productId}/compare`),
};
