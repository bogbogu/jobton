import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
    return (
        <>
            <header className="shadow-sm bg-white navbar">
                <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        Jobton
                    </Link>

                    <ul className="hidden md:flex items-center gap-8">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/jobs">Jobs</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                    </ul>

                    <div className="flex items-center gap-3">
                        <Link to="/login">Login</Link>
                        <Link to="/register">Sign Up</Link>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Navbar