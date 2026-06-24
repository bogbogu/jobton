import React from 'react'
import { Link } from 'react-router'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Hero = () => {

  return (
    <>
      <section className="hero-section mx-auto">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative flex items-center min-h-screen max-w-6xl mx-auto px-6">
          <div className="text-white md:w-1/2 text-center md:text-left mx-auto md:mx-0">
            <p className="inline-block bg-blue-500/20 px-4 py-2 rounded-full mb-6">
              <FontAwesomeIcon icon="chart-line" className="mr-2" />
              Track. Manage. Succeed.
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Your Job Search, <br />
              <span className="text-[#6593FC]">Organized.</span>
            </h1>

            <h2 className="text-lg text-gray-300 mb-8 max-w-md">
              Track applications, follow-ups, and interviews all in one place.
              Stay focused and land your next opportunity.
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
              <Link
                to="/"
                className="bg-[#6593FC] px-6 py-3 rounded-lg inline-block font-medium hover:opacity-90"
              >
                Get Started
              </Link>
              <Link
                to="/"
                className="bg-white text-[#6593FC] px-6  sm:ml-2 py-3 rounded-lg inline-block font-medium hover:opacity-90"
              >
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
