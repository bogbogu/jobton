import { useId, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Users,
  Calendar,
  Building2,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import type { Job } from "../../../types/job-type";
import CompanyLogo from "../../../components/CompanyLogo";
import ApplyContacts from "../../../components/ApplyContacts";
import { companyName, companyPageSlug, jobLogoDomain, safeHttpUrl } from "../../../utils/jobDisplay";

type TabName = "Overview" | "About Company" | "Requirements" | "Benefits";

// Post text is untrusted: keep only non-blank strings and render them as plain text.
const cleanList = (items?: string[] | null): string[] =>
  Array.isArray(items)
    ? items.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

const cleanText = (value?: string | null): string => (typeof value === "string" ? value.trim() : "");

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-400 marker:text-blue-600">
    {items.map((item, i) => (
      <li key={i} className="whitespace-pre-line break-words [overflow-wrap:anywhere]">
        {item}
      </li>
    ))}
  </ul>
);

const JobDetail = ({ job }: { job: Job }) => {
  const [selectedTab, setSelectedTab] = useState<TabName>("Overview");
  const tabsId = useId();
  const aboutCompany = cleanText(job.aboutCompany);
  const requirements = cleanList(job.requirements);
  const benefits = cleanList(job.benefits);

  // Overview always shows; the others only when the job has that content.
  const tabs: TabName[] = [
    "Overview",
    ...(aboutCompany ? (["About Company"] as const) : []),
    ...(requirements.length > 0 ? (["Requirements"] as const) : []),
    ...(benefits.length > 0 ? (["Benefits"] as const) : []),
  ];
  // If the selected tab no longer exists (the job changed), fall back to Overview.
  const activeTab: TabName = tabs.includes(selectedTab) ? selectedTab : "Overview";
  const tabDomId = (tab: TabName) => `${tabsId}-tab-${tab.toLowerCase().replace(/\s+/g, "-")}`;
  const panelDomId = (tab: TabName) => `${tabsId}-panel-${tab.toLowerCase().replace(/\s+/g, "-")}`;

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowLeft":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    setSelectedTab(tabs[next]);
    document.getElementById(tabDomId(tabs[next]))?.focus();
  };

  const telegramChannel = job.source?.channel?.trim().replace(/^@+/, "") ?? "";
  const telegramUrl = safeHttpUrl(job.source?.url);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start gap-4">
        <CompanyLogo
          key={job.id}
          company={job.company ?? undefined}
          domain={jobLogoDomain(job)}
          logoUrl={job.logo_url}
        />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {companyPageSlug(job) ? (
              <Link
                to={`/companies/${companyPageSlug(job)}`}
                className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {companyName(job)}
              </Link>
            ) : (
              <p className="font-semibold text-slate-700 dark:text-slate-300">{companyName(job)}</p>
            )}
            {job.status.includes("verified") && (
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                Verified Employer
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-1 dark:text-white">{job.title}</h2>
        </div>
      </div>

      {/* Meta chips */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <MapPin size={15} />
          {job.location ?? "Location not specified"}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase size={15} />
          {job.type ?? "Job type not specified"}
        </span>
        <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
          {job.salary}
        </span>
      </div>

      {/* Posted + applicants */}
      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>Posted {job.posted}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Users size={13} />
          {job.applicants} applicants
        </span>
      </div>

      {/* Apply button */}
      <ApplyContacts job={job} />

      {job.source?.kind === "telegram" && telegramChannel && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          {telegramUrl ? (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-2 hover:underline"
            >
              Found on Telegram: @{telegramChannel}
            </a>
          ) : (
            <>Found on Telegram: @{telegramChannel}</>
          )}
        </p>
      )}

      {/* Tabs */}
      <div className="mt-8 border-b border-slate-200 dark:border-slate-700">
        <div role="tablist" aria-label="Job details" className="flex gap-1 overflow-x-auto overflow-y-hidden scrollbar-none">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              role="tab"
              id={tabDomId(tab)}
              aria-selected={activeTab === tab}
              aria-controls={panelDomId(tab)}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setSelectedTab(tab)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`shrink-0 px-3 pb-3 text-sm font-medium transition border-b-2 -mb-px ${activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div
          role="tabpanel"
          id={panelDomId("Overview")}
          aria-labelledby={tabDomId("Overview")}
          tabIndex={0}
          className="mt-6 space-y-7 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        >
          {/* Job Overview Grid */}
          <div>
            <h3 className="font-bold text-lg mb-4 dark:text-white">Job Overview</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Calendar size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Date Posted</p>
                  <p className="text-sm font-medium dark:text-slate-200">{job.datePosted}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <MapPin size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
                  <p className="text-sm font-medium dark:text-slate-200">{job.location ?? "Location not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Users size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Experience</p>
                  <p className="text-sm font-medium dark:text-slate-200">{job.experience}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Briefcase size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Employment Type</p>
                  <p className="text-sm font-medium dark:text-slate-200">{job.type ?? "Job type not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Building2 size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Industry</p>
                  <p className="text-sm font-medium dark:text-slate-200">{job.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <GraduationCap size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Qualification</p>
                  <p className="text-sm font-medium dark:text-slate-200">{job.qualification}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="font-bold text-lg mb-3 dark:text-white">Job Description</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          <div>
            <h4 className="font-semibold mb-3 dark:text-white">What you will do</h4>
            <ul className="space-y-2.5">
              {job.responsibilities.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2
                    size={16}
                    className="text-blue-600 mt-0.5 shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "About Company" && (
        <div
          role="tabpanel"
          id={panelDomId("About Company")}
          aria-labelledby={tabDomId("About Company")}
          tabIndex={0}
          className="mt-6 space-y-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        >
          <h3 className="font-bold text-lg dark:text-white">About {companyName(job)}</h3>
          <p className="whitespace-pre-line break-words [overflow-wrap:anywhere] text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {aboutCompany}
          </p>
        </div>
      )}

      {activeTab === "Requirements" && (
        <div
          role="tabpanel"
          id={panelDomId("Requirements")}
          aria-labelledby={tabDomId("Requirements")}
          tabIndex={0}
          className="mt-6 space-y-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        >
          <h3 className="font-bold text-lg dark:text-white">Requirements</h3>
          <BulletList items={requirements} />
        </div>
      )}

      {activeTab === "Benefits" && (
        <div
          role="tabpanel"
          id={panelDomId("Benefits")}
          aria-labelledby={tabDomId("Benefits")}
          tabIndex={0}
          className="mt-6 space-y-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        >
          <h3 className="font-bold text-lg dark:text-white">Benefits</h3>
          <BulletList items={benefits} />
        </div>
      )}
    </div>
  );
};

export default JobDetail;
