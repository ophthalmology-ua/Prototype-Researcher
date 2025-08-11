import { Helmet } from "react-helmet-async";
import hero from "@/assets/hero-oct.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getOverviewStats } from "@/data/mock";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip as RTooltip } from "recharts";

const stats = getOverviewStats();

const severityColors = {
  early: `hsl(var(--severity-early))`,
  intermediate: `hsl(var(--severity-intermediate))`,
  advanced: `hsl(var(--severity-advanced))`,
};

export default function Dashboard() {
  const ageData = Object.entries(stats.byAge).map(([name, value]) => ({ name, value }));
  const genderData = Object.entries(stats.byGender).map(([name, value]) => ({ name, value }));
  const severityData = Object.entries(stats.bySeverity).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <Helmet>
        <title>Overview | AMD Ocular Insight</title>
        <meta name="description" content="High-level anonymized OCT statistics: patients, studies, and distributions by age, gender, and diagnosis severity." />
        <link rel="canonical" href="/" />
      </Helmet>
      <header className="relative">
        <img src={hero} alt="Abstract OCT retina waves hero banner" loading="eager" className="w-full h-56 object-cover" />
      </header>
      <section className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Total Patients</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{stats.totalPatients.toLocaleString()}</CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Total OCT Studies</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground cursor-help">ⓘ</span>
                </TooltipTrigger>
                <TooltipContent>Anonymized, aggregated count</TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{stats.totalStudies.toLocaleString()}</CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Data Anonymization</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">All metrics represent aggregated, non-identifiable cohorts.</CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Age Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData}>
                  <CartesianGrid stroke={`hsl(var(--chart-grid))`} strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RTooltip />
                  <Bar dataKey="value" fill={`hsl(var(--brand))`} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={90}>
                    <Cell fill={`hsl(var(--gender-male))`} />
                    <Cell fill={`hsl(var(--gender-female))`} />
                  </Pie>
                  <Legend />
                  <RTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diagnosis Severity</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={severityData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={90}>
                    <Cell fill={severityColors.early} />
                    <Cell fill={severityColors.intermediate} />
                    <Cell fill={severityColors.advanced} />
                  </Pie>
                  <Legend />
                  <RTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
