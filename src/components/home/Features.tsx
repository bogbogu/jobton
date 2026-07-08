import { ShieldCheck, Building2, Search, Lock } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Jobs",
    description: "Every job is reviewed by our team.",
  },
  {
    icon: Building2,
    title: "Trusted Employers",
    description: "Jobs from reputable companies.",
  },
  {
    icon: Search,
    title: "No Hidden Fees",
    description: "100% free to search and apply.",
  },
  {
    icon: Lock,
    title: "Safe & Secure",
    description: "We protect you from scams and fraud.",
  },
];

const Features = () => {
  return (
    <section className="bg-white max-w-7xl mx-auto py-10">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-2- lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                  <Icon size={24} strokeWidth={2} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;