"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const ageData = {
  summary: {
    totalUsers: 70,
    admins: 2,
    regular: 68
  },
  distribution: [
    { age: "Under 18", users: 0 },
    { age: "18-21", users: 34 },
    { age: "22-25", users: 36 },
    { age: "26-30", users: 0 },
    { age: "31+", users: 0 }
  ]
};

export function Chart08() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="space-y-0.5">
          <CardTitle>Age Distribution</CardTitle>
          <div className="text-sm text-muted-foreground">
            Breakdown of user age groups
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6 ">
          <div className="bg-blue-50/50 dark:bg-blue-950/50 rounded-lg p-2 text-center">
            <div className="text-2xl font-bold">{ageData.summary.totalUsers}</div>
            <div className="text-sm text-muted-foreground ">Total Users</div>
          </div>
          <div className="bg-purple-50/50 dark:bg-purple-950/50 rounded-lg p-2 text-center">
            <div className="text-2xl font-bold">{ageData.summary.admins}</div>
            <div className="text-sm text-muted-foreground">Admins</div>
          </div>
          <div className="bg-green-50/50 dark:bg-green-950/50 rounded-lg p-2 text-center">
            <div className="text-2xl font-bold">{ageData.summary.regular}</div>
            <div className="text-sm text-muted-foreground">Regular</div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData.distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="var(--border)" vertical={false} />
              <XAxis 
                dataKey="age" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                stroke="var(--muted-foreground)"
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                stroke="var(--muted-foreground)"
              />
              <Bar 
                dataKey="users" 
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 