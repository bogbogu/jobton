import { Link } from 'react-router-dom'

const RecruitmentAd = () => {
    return (
        // <>
        <section className="flex flex-row justify-evenly p-8 bg-blue-50 dark:bg-slate-800 transition-colors duration-200">
            <div className="flex items-center justify-between gap-12 min-w-2  mx-auto- ">
                <div className="flex flex-col items-start max-w-md gap-6">
                    <h2 className="text-3xl font-bold dark:text-white">
                        Recruiting?
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400">
                        Discover real online jobs in Nigeria that pay and build steady income
                        from anywhere.
                    </p>
                    <Link
                        to="/"
                        className="self-start rounded-md bg-[#6593FC]- px-6 py-3 text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Check it out
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default RecruitmentAd