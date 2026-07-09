import Hero from './home/Hero'
import HowItWorks from './home/HowItWorks'
import Metrics from './home/Metrics'
import Features from './home/Features'
import FeaturedJobs from './home/FeaturedJobs'
import PopularCategories from './home/PopularCategories'

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