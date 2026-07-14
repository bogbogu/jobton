import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import hireFreelancersImage from '../../assets/images/hire-freelancers.png'

const RecruitmentAd = () => {
    return (
        <section className="bg-blue-50 px-6 py-6 transition-colors duration-200 dark:bg-slate-800 md:px-10 lg:px-12">
            <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-12">
                <div className="flex flex-col items-start gap-6">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Looking to hire freelancers?
                    </h2>

                    <p className="max-w-lg text-gray-600 dark:text-slate-400">
                        Find skilled, verified freelancers with the right talent for your next project    </p>

                    <Link
                        to="/freelancers"
                        className="group inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        Hire Now
                        <ArrowRight
                            size={18}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                <div className="order-first hidden md:flex md:order-none md:justify-self-end">
                    <img
                        src={hireFreelancersImage}
                        alt="Hire freelancers"
                        className="mx-auto w-full max-w-sm object-contain md:max-w-md lg:max-w-lg"
                    />
                </div>
            </div>
        </section>
    )
}

export default RecruitmentAd