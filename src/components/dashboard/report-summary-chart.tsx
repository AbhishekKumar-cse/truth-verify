"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

const chartData = [
  { label: "True", value: 450 },
  { label: "False", value: 380 },
  { label: "Mixed", value: 290 },
  { label: "Unverified", value: 180 },
]

const chartConfig = {
  value: {
    label: "Reports",
    color: "hsl(var(--chart-1))",
  },
}

export function ReportSummaryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10 }}
          >
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <XAxis dataKey="value" type="number" hide />
            <Bar dataKey="value" layout="vertical" radius={4} fill="var(--color-value)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
