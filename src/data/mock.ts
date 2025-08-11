export type AgeRange = "60-64" | "65-69" | "70-74" | "75-79" | "80+";
export type Gender = "male" | "female";
export type Severity = "early" | "intermediate" | "advanced";
export type Region = "North" | "South" | "East" | "West" | "Central";

export interface PatientSummary {
  id: string;
  ageRange: AgeRange;
  gender: Gender;
  region: Region;
  lastStudy: string; // YYYY-MM
  severity: Severity;
}

const ageRanges: AgeRange[] = ["60-64", "65-69", "70-74", "75-79", "80+"];
const genders: Gender[] = ["male", "female"];
const severities: Severity[] = ["early", "intermediate", "advanced"];
const regions: Region[] = ["North", "South", "East", "West", "Central"];

function randomSeeded(seed: number) {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

export function generatePatients(count = 250, seed = 42): PatientSummary[] {
  const rnd = randomSeeded(seed);
  const list: PatientSummary[] = [];
  for (let i = 0; i < count; i++) {
    const age = ageRanges[Math.floor(rnd() * ageRanges.length)];
    const gender = genders[Math.floor(rnd() * genders.length)];
    const region = regions[Math.floor(rnd() * regions.length)];
    const sevWeight = rnd();
    const severity = sevWeight < 0.5 ? "early" : sevWeight < 0.8 ? "intermediate" : "advanced";
    const year = 2023 + Math.floor(rnd() * 3); // 2023-2025
    const month = 1 + Math.floor(rnd() * 12);
    const lastStudy = `${year}-${String(month).padStart(2, "0")}`;
    const id = `P-${Math.floor(rnd() * 1e8).toString(16).padStart(8, "0")}`;
    list.push({ id, ageRange: age, gender, region, lastStudy, severity });
  }
  return list;
}

export const patients = generatePatients();

export function getOverviewStats(data = patients) {
  const totalPatients = data.length;
  const totalStudies = Math.round(totalPatients * 3.2);
  const byAge = Object.fromEntries(ageRanges.map((a) => [a, data.filter((d) => d.ageRange === a).length]));
  const byGender = Object.fromEntries(genders.map((g) => [g, data.filter((d) => d.gender === g).length]));
  const bySeverity = Object.fromEntries(severities.map((s) => [s, data.filter((d) => d.severity === s).length]));
  return { totalPatients, totalStudies, byAge, byGender, bySeverity };
}

export function monthlyTrend(data = patients, field: "patients" | "severity") {
  const buckets = new Map<string, { patients: number; severity: number; count: number }>();
  data.forEach((d) => {
    const key = d.lastStudy;
    if (!buckets.has(key)) buckets.set(key, { patients: 0, severity: 0, count: 0 });
    const b = buckets.get(key)!;
    b.patients += 1;
    b.severity += d.severity === "early" ? 1 : d.severity === "intermediate" ? 2 : 3;
    b.count += 1;
  });
  const out = Array.from(buckets.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, v]) => ({ month, patients: v.patients, avgSeverity: +(v.severity / v.count).toFixed(2) }));
  return out.map((d) => ({ ...d, value: field === "patients" ? d.patients : d.avgSeverity }));
}

export const lists = { ageRanges, genders, severities, regions };
