import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patients as allPatients, lists, PatientSummary } from "@/data/mock";
import { exportToCSV, exportToJSON } from "@/utils/export";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function Patients() {
  const [age, setAge] = useState<string | "all">("all");
  const [gender, setGender] = useState<string | "all">("all");
  const [region, setRegion] = useState<string | "all">("all");
  const [severity, setSeverity] = useState<string | "all">("all");
  const [sortKey, setSortKey] = useState<keyof PatientSummary>("lastStudy");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return allPatients.filter((p) =>
      (age === "all" || p.ageRange === age) &&
      (gender === "all" || p.gender === gender) &&
      (region === "all" || p.region === region) &&
      (severity === "all" || p.severity === severity)
    );
  }, [age, gender, region, severity]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va < (vb as any)) return sortDir === "asc" ? -1 : 1;
      if (va > (vb as any)) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: keyof PatientSummary) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <section className="container mx-auto p-4">
      <Helmet>
        <title>Patients | AMD Ocular Insight</title>
        <meta name="description" content="Anonymized patient summaries with filtering, sorting, pagination, and export." />
        <link rel="canonical" href="/patients" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Patient Summaries</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Age Range</label>
            <Select value={age} onValueChange={(v: any) => { setAge(v); setPage(1); }}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {lists.ageRanges.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Gender</label>
            <Select value={gender} onValueChange={(v: any) => { setGender(v); setPage(1); }}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {lists.genders.map((g) => (<SelectItem key={g} value={g}>{g}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Region</label>
            <Select value={region} onValueChange={(v: any) => { setRegion(v); setPage(1); }}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {lists.regions.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Severity</label>
            <Select value={severity} onValueChange={(v: any) => { setSeverity(v); setPage(1); }}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {lists.severities.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-muted-foreground">{sorted.length} records</div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => exportToCSV(sorted, "patients.csv")}>Export CSV</Button>
          <Button variant="outline" onClick={() => exportToJSON(sorted, "patients.json")}>Export JSON</Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("id")}>Hashed ID</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("ageRange")}>Age Range</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("gender")}>Gender</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("region")}>Region</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("lastStudy")}>Last Study (YYYY-MM)</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("severity")}>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.ageRange}</TableCell>
                  <TableCell>{p.gender}</TableCell>
                  <TableCell>{p.region}</TableCell>
                  <TableCell>{p.lastStudy}</TableCell>
                  <TableCell>
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor:
                          p.severity === "early"
                            ? `hsl(var(--severity-early) / 0.15)`
                            : p.severity === "intermediate"
                            ? `hsl(var(--severity-intermediate) / 0.15)`
                            : `hsl(var(--severity-advanced) / 0.15)`,
                        color:
                          p.severity === "early"
                            ? `hsl(var(--severity-early))`
                            : p.severity === "intermediate"
                            ? `hsl(var(--severity-intermediate))`
                            : `hsl(var(--severity-advanced))`,
                      }}
                    >
                      {p.severity}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
            </PaginationItem>
            <span className="px-3 text-sm text-muted-foreground">Page {page} of {pageCount}</span>
            <PaginationItem>
              <PaginationNext onClick={() => setPage((p) => Math.min(pageCount, p + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}
