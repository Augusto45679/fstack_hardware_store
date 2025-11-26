"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PriceHistoryItem } from "@/lib/api"

interface PriceHistoryChartProps {
    history: PriceHistoryItem[];
    loading: boolean;
}

export function PriceHistoryChart({ history, loading }: PriceHistoryChartProps) {
    if (loading) {
        return (
            <Card className="h-[400px] flex items-center justify-center">
                <div className="text-muted-foreground">Loading chart...</div>
            </Card>
        );
    }

    if (!history || history.length === 0) {
        return (
            <Card className="h-[400px] flex items-center justify-center">
                <div className="text-muted-foreground">No price history available</div>
            </Card>
        );
    }

    // Format data for chart if needed, or use as is if structure matches
    // Recharts expects array of objects.
    const data = history.map(item => ({
        date: item.date,
        price: item.price,
        store: item.store
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Price History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)' }}
                                formatter={(value: number) => [`$${value}`, "Price"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
