import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <main className="pt-16">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default MainLayout
