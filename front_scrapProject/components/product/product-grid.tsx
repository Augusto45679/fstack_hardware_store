import { Product } from "@/lib/api";
import { ProductCard } from "@/components/product-card";

interface ProductGridProps {
    products: Product[];
    loading: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-[300px] rounded-lg bg-muted animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-muted-foreground">
                    No products found
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search terms
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
            ))}
        </div>
    );
}
