import React from 'react'
import Navbar from './layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from './home/Hero'
import HowItWorks from './home/HowItWorks'
import Metrics from './home/Metrics'
import Features from './home/Features'

const Home = () => {
    return (
    <>
    {/* <Navbar /> */}
    <Hero />
    <Features />
    <Metrics />
    <HowItWorks />
    <Footer />

    </>
    )
}

export default Home