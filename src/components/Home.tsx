import React from 'react'
import Navbar from './layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from './home/Hero'
import HowItWorks from './home/HowItWorks'
import Metrics from './home/Metrics'

const Home = () => {
    return (
    <>
    {/* <Navbar /> */}
    <Hero />
    <Metrics />
    <HowItWorks />
    <Footer />

    </>
    )
}

export default Home