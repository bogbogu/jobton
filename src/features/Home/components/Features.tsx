import { featureItems } from "../../../constants/features";

const Features = () => {
  return (
    <section className="bg-white dark:bg-slate-900 max-w-7xl mx-auto py-10 transition-colors duration-200">
      <div className="container mx-auto px-6">

        {/* Mobile — compact icon + title grid */}
        <div className="grid grid-cols-4 gap-3 sm:hidden">
          {featureItems.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">{feature.title}</p>
              </div>
            );
          })}
        </div>

        {/* Tablet and above — icon + title + description */}
        <div className="hidden sm:grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featureItems.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600">
                  <Icon size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{feature.description}</p>
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
