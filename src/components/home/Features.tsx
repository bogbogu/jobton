import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faBuilding,
  faMagnifyingGlass,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    icon: faShieldHalved,
    title: "Verified Jobs",
    description: "Every job is reviewed by our team.",
  },
  {
    icon: faBuilding,
    title: "Trusted Employers",
    description: "Jobs from reputable companies.",
  },
  {
    icon: faMagnifyingGlass,
    title: "No Hidden Fees",
    description: "100% free to search and apply.",
  },
  {
    icon: faLock,
    title: "Safe & Secure",
    description: "We protect you from scams and fraud.",
  },
];

const Features = () => {
  return (
        <>
        
    <section className="bg-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                <FontAwesomeIcon icon={feature.icon} />
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
          ))}
        </div>
      </div>
    </section>
        </>
    )
}

export default Features