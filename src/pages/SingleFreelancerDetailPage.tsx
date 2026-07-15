import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import FreelancerDetailsPanel from "../features/HireFreelancers/components/FreelancerDetailsPanel";
import { freelancers } from "../constants/freelancers";

const SingleFreelancerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const freelancer = useMemo(
    () => freelancers.find((item) => item.id === Number(id)) ?? null,
    [id]
  );

  if (!freelancer) {
    return (
      <section className="py-8 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <button
            type="button"
            onClick={() => navigate("/hire-freelancers")}
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Back to Freelancers
          </button>
          <p className="mt-6 text-slate-500 dark:text-slate-400">Freelancer profile not found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <button
          type="button"
          onClick={() => navigate("/hire-freelancers")}
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} />
          Back to Freelancers
        </button>

        <FreelancerDetailsPanel freelancer={freelancer} />
      </div>
    </section>
  );
};

export default SingleFreelancerDetailPage;
