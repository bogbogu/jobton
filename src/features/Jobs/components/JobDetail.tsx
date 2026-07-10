import { useState } from "react";
import {
  MapPin,
  Briefcase,
  Users,
  Calendar,
  Building2,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import type { Job } from "../../../hooks/useJobs";

const TABS = ["Overview", "About Company", "Requirements", "Benefits"];

const JobDetail = ({ job }: { job: Job }) => {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm overflow-y-auto max-h-[calc(100vh-160px)]">
      {/* Header */}
      <div className="flex items-start gap-4">
        <img
          src={job.logo}
          alt={job.company}
          className="h-14 w-14 rounded-xl object-contain border border-slate-100"
        />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-slate-700">{job.company}</p>
            {job.status.includes("verified") && (
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                Verified Employer
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-1">{job.title}</h2>
        </div>
      </div>

      {/* Meta chips */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <MapPin size={15} />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase size={15} />
          {job.type}
        </span>
        <span className="flex items-center gap-1.5 font-semibold text-slate-800">
          {job.salary}
        </span>
      </div>

      {/* Posted + applicants */}
      <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
        <span>Posted {job.posted}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Users size={13} />
          {job.applicants} applicants
        </span>
      </div>

      {/* Apply button */}
      <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
        Apply Now <ExternalLink size={14} />
      </button>

      {/* Tabs */}
      <div className="mt-8 border-b border-slate-200">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 pb-3 text-sm font-medium transition border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div className="mt-6 space-y-7">
          {/* Job Overview Grid */}
          <div>
            <h3 className="font-bold text-lg mb-4">Job Overview</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Calendar size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Date Posted</p>
                  <p className="text-sm font-medium">{job.datePosted}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <MapPin size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="text-sm font-medium">{job.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Users size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Experience</p>
                  <p className="text-sm font-medium">{job.experience}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Briefcase size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Employment Type</p>
                  <p className="text-sm font-medium">{job.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Building2 size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Industry</p>
                  <p className="text-sm font-medium">{job.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <GraduationCap size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Qualification</p>
                  <p className="text-sm font-medium">{job.qualification}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="font-bold text-lg mb-3">Job Description</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          <div>
            <h4 className="font-semibold mb-3">What you will do</h4>
            <ul className="space-y-2.5">
              {job.responsibilities.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
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

      {activeTab !== "Overview" && (
        <p className="mt-8 text-sm text-slate-400 italic">Content coming soon.</p>
      )}
    </div>
  );
};

export default JobDetail;
