/** Plain-word names for the technical field keys the backend and extraction report. */
const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  company: "Company",
  location: "Location",
  category: "Category",
  description: "Description",
  skills: "Skills",
  applyContact: "How to apply",
  applicationLink: "Application link",
  applyEmail: "Apply email",
  applyPhone: "Apply phone",
  employmentType: "Job type",
  workArrangement: "Work arrangement",
  salary: "Salary",
  salaryMin: "Salary",
  salaryMax: "Salary",
  salaryCurrency: "Currency",
  salaryPeriod: "Salary period",
  industry: "Industry",
  experience: "Experience",
  qualification: "Qualification",
  responsibilities: "Responsibilities",
  domain: "Company website",
};

/** "salaryMin" -> "Salary"; unknown keys become spaced, capitalized words. */
export const humanizeField = (key: string): string => {
  const known = FIELD_LABELS[key];
  if (known) return known;

  const spaced = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .toLowerCase();
  return spaced ? spaced.charAt(0).toUpperCase() + spaced.slice(1) : key;
};

/** Human labels for a list of keys, without repeats (salaryMin + salaryMax -> one "Salary"). */
export const humanizeFields = (keys: readonly string[]): string[] => [
  ...new Set(keys.map(humanizeField)),
];
