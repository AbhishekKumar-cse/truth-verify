"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { browser: "misinformation", visitors: 275, fill: "var(--color-blue-500)" },
  { browser: "information", visitors: 200, fill: "var(--color-blue-300)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  misinformation: {
    label: "Misinformation",
    color: "hsl(var(--chart-1))",
  },
  information: {
    label: "Information",
    color: "hsl(var(--chart-2))",
  },
}

export function MisinformationTrendsChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Misinformation Trends</CardTitle>
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
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
                <Cell key="cell-0" fill="hsl(var(--chart-1))" />
                <Cell key="cell-1" fill="hsl(var(--chart-1) / 0.3)" />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex w-full items-center justify-center gap-2 font-medium leading-none">
          43% Misinformation
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
