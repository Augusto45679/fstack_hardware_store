"use client"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface ProductPaginationProps {
    currentPage: number
    totalPages: number
    totalResults: number
    onPageChange: (page: number) => void
}

export function ProductPagination({
    currentPage,
    totalPages,
    totalResults,
    onPageChange,
}: ProductPaginationProps) {
    if (totalPages <= 1) {
        return null
    }

    const generatePageNumbers = () => {
        const pages: (number | "ellipsis")[] = []
        const showPages = 7 // Total number of page buttons to show

        if (totalPages <= showPages) {
            // Show all pages if total pages is less than or equal to showPages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            // Calculate range around current page
            let startPage = Math.max(2, currentPage - 1)
            let endPage = Math.min(totalPages - 1, currentPage + 1)

            // Adjust if we're near the start
            if (currentPage <= 3) {
                endPage = 4
            }

            // Adjust if we're near the end
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pages.push("ellipsis")
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i)
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pages.push("ellipsis")
            }

            // Always show last page
            pages.push(totalPages)
        }

        return pages
    }

    const pages = generatePageNumbers()

    return (
        <div className="mt-8 space-y-4">
            {/* Results Info */}
            <div className="text-center text-sm text-muted-foreground">
                Mostrando{" "}
                <span className="font-medium text-foreground">
                    {totalResults > 0 ? (currentPage - 1) * 20 + 1 : 0}
                </span>
                -
                <span className="font-medium text-foreground">
                    {Math.min(currentPage * 20, totalResults)}
                </span>{" "}
                de{" "}
                <span className="font-medium text-foreground">{totalResults}</span>{" "}
                resultados
            </div>

            {/* Pagination Controls */}
            <Pagination>
                <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) {
                                    onPageChange(currentPage - 1)
                                }
                            }}
                            className={
                                currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {pages.map((page, index) => (
                        <PaginationItem key={index}>
                            {page === "ellipsis" ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onPageChange(page)
                                    }}
                                    isActive={currentPage === page}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    {/* Next Button */}
                    <PaginationItem>
                        <PaginationNext
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) {
                                    onPageChange(currentPage + 1)
                                }
                            }}
                            className={
                                currentPage === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
