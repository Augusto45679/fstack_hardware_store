import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { ProductComparisonItem } from "@/lib/api"

interface ComparisonTableProps {
    comparison: ProductComparisonItem[];
    loading: boolean;
}

export function ComparisonTable({ comparison, loading }: ComparisonTableProps) {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Store Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="h-10 bg-muted rounded animate-pulse" />
                        <div className="h-10 bg-muted rounded animate-pulse" />
                        <div className="h-10 bg-muted rounded animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!comparison || comparison.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Store Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4 text-muted-foreground">
                        No comparison data available
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Store Comparison</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Store</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comparison.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item.store}</TableCell>
                                <TableCell>${item.price}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild size="sm" variant="outline">
                                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                                            View Deal <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
