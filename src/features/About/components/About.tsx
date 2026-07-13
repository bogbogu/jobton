import { BriefcaseBusiness, Handshake, Sparkles, Target } from "lucide-react";

const valueCards = [
  {
    title: "Trusted Opportunities",
    description:
      "We focus on connecting people to verified jobs and real freelance projects.",
    icon: Target,
  },
  {
    title: "Human-Centered Hiring",
    description:
      "Every feature is built to help employers and talent make faster, clearer decisions.",
    icon: Handshake,
  },
  {
    title: "Career Growth",
    description:
      "Beyond job listings, we support practical career growth through insights and guidance.",
    icon: Sparkles,
  },
  {
    title: "Results That Matter",
    description:
      "From job discovery to freelancer outreach, we optimize for quality outcomes.",
    icon: BriefcaseBusiness,
  },
];

const About = () => {
  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-14 md:py-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 md:p-8 shadow-sm">
            <p className="text-blue-600 font-medium">Who We Are</p>
            <h2 className="mt-2 text-2xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Building better career matches across Nigeria.
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              Jobton is a hiring platform where professionals discover quality opportunities and employers connect with skilled people quickly.
              We combine structured job discovery with a growing freelancer marketplace so teams can hire confidently.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-700/60 p-3">
                <p className="text-lg font-bold text-slate-900 dark:text-white">10k+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Active users</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-700/60 p-3">
                <p className="text-lg font-bold text-slate-900 dark:text-white">4k+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Jobs listed</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-700/60 p-3">
                <p className="text-lg font-bold text-slate-900 dark:text-white">900+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Freelancers</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {valueCards.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 md:p-6"
                >
                  <div className="inline-flex rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 p-2.5 mb-4">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
