"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
const chartData = [
  { category: "Politics", count: 250, fill: "var(--color-politics)" },
  { category: "Health", count: 187, fill: "var(--color-health)" },
  { category: "Science", count: 120, fill: "var(--color-science)" },
]

const chartConfig = {
  count: {
    label: "Count",
  },
  Politics: {
    label: "Politics",
    color: "hsl(var(--chart-1))",
  },
  Health: {
    label: "Health",
    color: "hsl(var(--chart-2))",
  },
  Science: {
    label: "Science",
    color: "hsl(var(--chart-3))",
  },
}

export function CategoryDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              innerRadius={50}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-[2px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
