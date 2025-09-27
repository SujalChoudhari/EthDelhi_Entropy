"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const pieData = {
  total: 15879,
  growth: "+2.5%",
  data: [
    {
      name: "Enterprise",
      value: 4800,
      color: "var(--chart-1)"
    },
    {
      name: "Small Business",
      value: 3200,
      color: "var(--chart-2)"
    },
    {
      name: "Consumer",
      value: 4879,
      color: "var(--chart-4)"
    },
    {
      name: "Education",
      value: 3000,
      color: "var(--chart-6)"
    }
  ]
};

export function Chart07() {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle>Distribution by Segment</CardTitle>
            <div className="flex items-start gap-2">
              <div className="font-semibold text-2xl">
                {pieData.total.toLocaleString()}
              </div>
              <Badge className="mt-1.5 bg-emerald-500/24 text-emerald-500 border-none">
                {pieData.growth}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {pieData.data.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-sm"
                  style={{ background: entry.color }}
                ></div>
                <div className="text-[13px]/3 text-muted-foreground/80">
                  {entry.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="stroke-background hover:opacity-80 transition-opacity"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="size-2 rounded-full"
                              style={{ background: payload[0].payload.color }}
                            />
                            <span className="font-medium">{payload[0].name}</span>
                          </div>
                          <div className="text-right font-medium">
                            {payload[0]?.value?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 