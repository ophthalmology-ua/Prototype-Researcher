import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lists, monthlyTrend, patients } from "@/data/mock";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend } from "recharts";
import { useMemo, useState } from "react";

export default function Trends() {
  const [field, setField] = useState<"patients" | "severity">("patients");
  const [groupBy, setGroupBy] = useState<"all" | "gender" | "region">("all");

  const data = useMemo(() => monthlyTrend(patients, field), [field]);

  return (
    <section className="container mx-auto p-4">
      <Helmet>
        <title>Trends | AMD Ocular Insight</title>
        <meta name="description" content="Temporal trends for anonymized AMD OCT cohorts with grouping and filters." />
        <link rel="canonical" href="/trends" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Trends Over Time</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Controls</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Metric</label>
            <Select value={field} onValueChange={(v: any) => setField(v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="patients">New Patients</SelectItem>
                <SelectItem value="severity">Avg. Severity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Group By</label>
            <Select value={groupBy} onValueChange={(v: any) => setGroupBy(v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="gender">Gender</SelectItem>
                <SelectItem value="region">Region</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly {field === "patients" ? "New Patients" : "Average Severity"}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid stroke={`hsl(var(--chart-grid))`} strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RTooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stroke={`hsl(var(--brand))`} fill={`hsl(var(--brand) / 0.35)`} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
}
