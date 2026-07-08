import React from 'react'
import Navbar from './layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from './home/Hero'
import HowItWorks from './home/HowItWorks'
import Metrics from './home/Metrics'
import Features from './home/Features'
import FeaturedJobs from './home/FeaturedJobs'
import PopularCategories from './home/PopularCategories'

const Home = () => {
    return (
        <>
            {/* <Navbar /> */}
            <Hero />
            <Features />
            <Metrics />
            <FeaturedJobs />
            <PopularCategories />
            <HowItWorks />
            <Footer />

        </>
    )
}

export default Home