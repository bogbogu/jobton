import Hero from './Hero'
import HowItWorks from './HowItWorks'
import Metrics from './Metrics'
import Features from './Features'
import FeaturedJobs from './FeaturedJobs'
import PopularCategories from './PopularCategories'

const Home = () => {
    return (
        <>
            <Hero />
            <Features />
            <Metrics />
            <FeaturedJobs />
            <PopularCategories />
            <HowItWorks />

        </>
    )
}

export default Home