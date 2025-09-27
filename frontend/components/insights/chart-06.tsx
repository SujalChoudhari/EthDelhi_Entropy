"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const subscriberData = {
  total: 26864,
  growth: "+3.4%",
  categories: [
    {
      name: "Individual",
      color: "var(--chart-4)",
      count: 4279,
      width: "22%",
      reason: "Needed access to premium tools."
    },
    {
      name: "Team",
      color: "var(--chart-1)",
      count: 4827,
      width: "24%",
      reason: "Enhanced assistance and protection.",
      gradient: true
    },
    {
      name: "Enterprise",
      color: "var(--chart-6)",
      count: 3556,
      width: "16%",
      reason: "Faster, more reliable experience."
    },
    {
      name: "Business",
      color: "var(--chart-3)",
      count: 6987,
      width: "38%",
      reason: "Scaling up operations."
    }
  ]
};

export function Chart06() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-10">
          <div className="space-y-0.5">
            <CardTitle>New Subscribers</CardTitle>
            <div className="flex items-start gap-2">
              <div className="font-semibold text-2xl">
                {subscriberData.total.toLocaleString()}
              </div>
              <Badge className="mt-1.5 bg-emerald-500/24 text-emerald-500 border-none">
                {subscriberData.growth}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-10">
            {subscriberData.categories.map((category) => (
              <div key={category.name} className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-sm"
                  style={{
                    background: category.gradient 
                      ? `linear-gradient(to right, var(--chart-2), var(--chart-1))`
                      : category.color
                  }}
                ></div>
                <div className="text-[13px]/3 text-muted-foreground/80">
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-10">
        {/* Bar Chart */}
        <div className="flex gap-1 h-5">
          {subscriberData.categories.map((category) => (
            <div
              key={category.name}
              className="h-full rounded-sm transition-all duration-200 hover:opacity-80"
              style={{
                width: category.width,
                background: category.gradient 
                  ? `linear-gradient(to right, var(--chart-2), var(--chart-1))`
                  : category.color
              }}
            ></div>
          ))}
        </div>

        {/* Reasons List */}
        <div>
          <div className="text-[13px]/3 text-muted-foreground/80 mb-3">
            Reason for upgrading
          </div>
          <ul className="text-sm divide-y divide-border">
            {subscriberData.categories.map((category) => (
              <li key={category.name} className="py-2 flex items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{
                    background: category.gradient 
                      ? `linear-gradient(to right, var(--chart-2), var(--chart-1))`
                      : category.color
                  }}
                  aria-hidden="true"
                ></span>
                <span className="grow text-muted-foreground">
                  {category.reason}
                </span>
                <span className="text-[13px]/3 font-medium text-foreground/70">
                  {category.count.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
