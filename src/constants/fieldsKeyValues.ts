export const jobTypeOptions = [
  { key: "FULL_TIME", value: "Full Time" },
  { key: "PART_TIME", value: "Part Time" },
  { key: "CONTRACT", value: "Contract" },
  { key: "INTERNSHIP", value: "Internship" },
  { key: "FREELANCE", value: "Freelance" },
  { key: "ON_SITE", value: "On-site" },
  { key: "REMOTE", value: "Remote" },
  { key: "HYBRID", value: "Hybrid" },
];

export const industryOptions = [
  { key: "TECHNOLOGY", value: "Technology" },
  { key: "FINTECH", value: "Fintech" },
  { key: "FINANCE", value: "Finance" },
  { key: "HEALTHCARE", value: "Healthcare" },
  { key: "EDUCATION", value: "Education" },
  { key: "MARKETING", value: "Marketing" },
  { key: "DESIGN", value: "Design" },
  { key: "SOCIAL_MEDIA", value: "Social Media" },
  { key: "ECOMMERCE", value: "E-Commerce" },
  { key: "LOGISTICS", value: "Logistics" },
  { key: "MEDIA", value: "Media & Entertainment" },
  { key: "CONSULTING", value: "Consulting" },
];

// Keep in sync with the category titles in src/hooks/useCategories.ts
// (CATEGORY_ICONS) — that's the taxonomy category cards link into via
// /jobs?category=<title>, so the filter dropdown here needs to offer the
// exact same values for "select from dropdown" and "click a card" to land
// on the same results.
export const categoryOptions = [
  { key: "TECHNOLOGY", value: "Technology" },
  { key: "MARKETING", value: "Marketing" },
  { key: "SALES", value: "Sales" },
  { key: "CUSTOMER_SERVICE", value: "Customer Service" },
  { key: "FINANCE", value: "Finance" },
  { key: "HEALTHCARE", value: "Healthcare" },
  { key: "SOFTWARE_DEVELOPMENT", value: "Software Development" },
  { key: "DESIGN", value: "Design" },
  { key: "ECOMMERCE", value: "E-commerce" },
  { key: "EDUCATION", value: "Education" },
  { key: "CYBERSECURITY", value: "Cybersecurity" },
  { key: "PUBLIC_SECTOR", value: "Public Sector" },
  { key: "ENGINEERING", value: "Engineering" },
  { key: "TRAVEL_HOSPITALITY", value: "Travel & Hospitality" },
  { key: "REAL_ESTATE", value: "Real Estate" },
  { key: "LEGAL", value: "Legal" },
  { key: "LOGISTICS", value: "Logistics" },
  { key: "CREATIVE_MEDIA", value: "Creative Media" },
];

export const sortOptions = [
  { key: "MOST_RECENT", value: "Most Recent" },
  { key: "OLDEST", value: "Oldest" },
  { key: "HIGHEST_SALARY", value: "Highest Salary" },
  { key: "MOST_APPLICANTS", value: "Most Applicants" },
];

export const experienceLevelOptions = [
  { key: "ENTRY", value: "Entry Level (0–2 years)" },
  { key: "MID", value: "Mid Level (2–5 years)" },
  { key: "SENIOR", value: "Senior Level (5+ years)" },
  { key: "EXECUTIVE", value: "Executive / Director" },
];

export const salaryRangeOptions = [
  { key: "BELOW_200K", value: "Below ₦200,000" },
  { key: "200K_500K", value: "₦200,000 – ₦500,000" },
  { key: "500K_1M", value: "₦500,000 – ₦1,000,000" },
  { key: "ABOVE_1M", value: "Above ₦1,000,000" },
];

export const reportReasonOptions = [
  { key: "MISLEADING", value: "Misleading or inaccurate details" },
  { key: "SCAM", value: "Potential scam or fraud" },
  { key: "SPAM", value: "Spam or duplicate posting" },
  { key: "INAPPROPRIATE", value: "Inappropriate or offensive content" },
  { key: "EXPIRED", value: "Position already filled or expired" },
  { key: "OTHER", value: "Other" },
];

export const OTHER_REPORT_REASON_KEY = "OTHER";
