import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { lists, patients } from "@/data/mock";
import { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from "recharts";

export default function Aggregates() {
  const [dimension, setDimension] = useState<"ageRange" | "gender" | "region" | "severity">("ageRange");

  const data = useMemo(() => {
    const m = new Map<string, number>();
    patients.forEach((p) => {
      const key = (p as any)[dimension] as string;
      m.set(key, (m.get(key) || 0) + 1);
    });
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [dimension]);

  return (
    <section className="container mx-auto p-4">
      <Helmet>
        <title>Aggregates | AMD Ocular Insight</title>
        <meta name="description" content="Custom aggregates with flexible grouping and filters." />
        <link rel="canonical" href="/aggregates" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Custom Aggregates</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Group & Compare</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Dimension</label>
            <Select value={dimension} onValueChange={(v: any) => setDimension(v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ageRange">Age Range</SelectItem>
                <SelectItem value="gender">Gender</SelectItem>
                <SelectItem value="region">Region</SelectItem>
                <SelectItem value="severity">Severity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Counts by {dimension}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke={`hsl(var(--chart-grid))`} strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RTooltip />
              <Bar dataKey="value" fill={`hsl(var(--brand))`} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
}
