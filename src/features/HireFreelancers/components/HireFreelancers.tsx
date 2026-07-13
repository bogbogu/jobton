import PageBanner from "../../../components/ui/PageBanner";
import { Search } from "lucide-react";
import FreelancerProfileCard from "../../../components/ui/FreelancerProfileCard";
import { useFreelancersService } from "../services/useFreelancersService";
import FreelancerDetailsPanel from "./FreelancerDetailsPanel";
import { X } from "lucide-react";

const HireFreelancers = () => {
  const {
    query,
    setQuery,
    category,
    setCategory,
    categories,
    filteredFreelancers,
    selectedFreelancer,
    selectedFreelancerId,
    setSelectedFreelancerId,
    showFreelancerDetailsModal,
    handleOpenFreelancerDetailsModal,
    handleCloseFreelancerDetailsModal,
  } = useFreelancersService();

  const handleFreelancerSelect = (id: number) => {
    setSelectedFreelancerId(id);
    if (window.innerWidth < 1024) {
      handleOpenFreelancerDetailsModal();
    }
  };

  return (
    <>
      <PageBanner
        pageTitle="Hire Freelancers"
        pageSubTitle="Browse verified talent, review profiles, and reach out instantly."
      />

      <section className="py-10 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 md:p-5 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xl">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name, role, location, or skill"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 pl-9 pr-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium border transition ${
                      category === item
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Showing {filteredFreelancers.length} freelancer profiles
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-5 space-y-3">
              {filteredFreelancers.map((freelancer) => (
                <FreelancerProfileCard
                  key={freelancer.id}
                  freelancer={freelancer}
                  isActive={selectedFreelancerId === freelancer.id}
                  onSelect={() => handleFreelancerSelect(freelancer.id)}
                />
              ))}

              {filteredFreelancers.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
                  No freelancers match your search right now.
                </div>
              )}
            </div>

            <div className="hidden lg:block lg:col-span-7 lg:sticky lg:top-24 self-start">
              <FreelancerDetailsPanel freelancer={selectedFreelancer} />
            </div>
          </div>
        </div>
      </section>

      {showFreelancerDetailsModal && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close freelancer details modal"
            onClick={handleCloseFreelancerDetailsModal}
            className="absolute inset-0 bg-slate-900/40"
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-4 sm:p-5">
            <button
              type="button"
              onClick={handleCloseFreelancerDetailsModal}
              className="absolute right-3 top-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <FreelancerDetailsPanel freelancer={selectedFreelancer} />
          </div>
        </div>
      )}
    </>
  );
};

export default HireFreelancers;
