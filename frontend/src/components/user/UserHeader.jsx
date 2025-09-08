import { Link, NavLink } from "react-router";
import { CalendarCheck, LayoutDashboard, Phone, Video } from "lucide-react";
import { useState } from "react";
import { closeMenu, darkLogo, menuIcon } from "../../assets";
import { useSelector } from "react-redux";

function UserHeader() {
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Contact', href: '/contact' },
        // { name: 'Testimonials', href: '/testimonials' },
    ];

    const services = [
        { name: 'Admissions', href: '/services' },
        { name: 'Accommodations', href: '/accommodations' },
    ];

    const isUserLoggedIn = useSelector(state => state.user.isUserLoggedIn);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="flex w-full p-4 md:px-10 justify-between border-b border-b-blue-100">
            <Link to="/" className="w-full z-50">
                <img src={darkLogo} alt="logo" className="h-9 md:h-10 z-50" />
            </Link>

            <nav className="hidden lg:block">
                <ul className="flex items-center gap-7">
                    {
                        navLinks.map(link => (
                            <li className="relative py-1" key={link.name}>
                                <NavLink className={({ isActive }) => `${isActive ? 'text-blue-600 after:bg-blue-600' : 'text-blue-950 after:bg-blue-950'} after:w-0 after:rounded after:h-0.5 after:absolute after:bottom-0 after:left-0 after:content-[""] hover:after:w-full after:transition-all after:duration-150`} to={link.href}>{link.name}</NavLink>
                            </li>
                        ))
                    }
                    <li className="flex items-center relative" onClick={() => setIsOpen(!isOpen)}>
                        <Link className={`${isScrolled ? 'text-blue-950 after:bg-blue-950' : 'text-white'}`}>Services</Link>

                        <svg className={`w-5 h-5 inline float-right transition-transform cursor-pointer duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={`${isScrolled ? '#172554' : '#fff'}`} >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>

                        {isOpen && (
                            <ul onClick={() => setIsOpen(false)} className="w-40 bg-white border border-white rounded shadow-md mt-2 absolute top-7">
                                {services.map((service) => (
                                    <li key={service.name} className="px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer" >
                                        <Link className="block" to={service.href}>{service.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                    <li>
                        {
                            isUserLoggedIn
                                ?
                                <Link to='/user/dashboard' className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                                    <LayoutDashboard size={24} strokeWidth={1.5} />

                                    <span>Dashboard</span>
                                </Link>
                                :
                                pathname === '/accommodations'
                                    ?
                                    <Link onClick={() => { setIsMenuOpen(false); }} to="/checkout/accommodations" className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                        <CalendarCheck size={24} strokeWidth={1.5} />

                                        <span>Book Now @ $399</span>
                                    </Link>
                                    :
                                    <button onClick={bookConsultationHandler} className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                        <Video size={24} strokeWidth={1.5} />

                                        <span>Book Consultation</span>
                                    </button>
                        }
                    </li>

                </ul>
            </nav>

            {/* Navlinks for smaller screens */}
            <nav className={`lg:hidden bg-white absolute top-0 left-0 min-h-screen w-0 transition-all duration-200 overflow-hidden text-center flex items-center justify-center ${isMenuOpen && 'w-full'} z-40`}>
                <ul className="">
                    {
                        navLinks.map(link => (
                            <li key={link.name} className="relative mx-5 py-2">
                                <NavLink className={({ isActive }) => `${isActive ? 'text-blue-600 after:bg-blue-600' : 'text-blue-950 after:bg-blue-950'} after:w-0 after:rounded after:h-0.5 after:absolute after:bottom-0 after:left-0 after:content-[""] hover:after:w-full after:transition-all after:duration-150`} to={link.href}>{link.name}</NavLink>
                            </li>
                        ))
                    }
                    <li className="flex items-center justify-center relative" onClick={() => setIsOpen(!isOpen)}>
                        <Link className={`${isScrolled ? 'text-blue-950 after:bg-blue-950' : 'text-white'}`}>Services</Link>

                        <svg className={`w-5 h-5 inline float-right transition-transform cursor-pointer duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={`${isScrolled ? '#172554' : '#fff'}`} >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>

                        {isOpen && (
                            <ul onClick={() => setIsOpen(false)} className="w-40 bg-white border border-white rounded shadow-md mt-2 absolute top-7">
                                {services.map((service) => (
                                    <li key={service.name} className="px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer" >
                                        <Link className="block" to={service.href}>{service.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                    <li className="mt-2">
                        {
                            isUserLoggedIn
                                ?
                                <Link to='/user/dashboard' className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                                    <LayoutDashboard size={24} strokeWidth={1.5} />

                                    <span>Dashboard</span>
                                </Link>
                                :
                                pathname === '/accommodations'
                                    ?
                                    <Link onClick={() => { setIsMenuOpen(false); }} to="/checkout/accommodations" className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                        <CalendarCheck size={24} strokeWidth={1.5} />

                                        <span>Book Now @ $399</span>
                                    </Link>
                                    :
                                    <button onClick={bookConsultationHandler} className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                        <Video size={24} strokeWidth={1.5} />

                                        <span>Book Consultation</span>
                                    </button>
                        }
                    </li>
                </ul>
            </nav>

            <div className="lg:hidden z-50 flex items-center gap-5">
                {
                    isMenuOpen ? (<img onClick={() => setIsMenuOpen(!isMenuOpen)} src={closeMenu} alt="menu icon" className={`h-7 cursor-pointer invert-25 z-50 ${isScrolled}`} />) : (<img onClick={() => setIsMenuOpen(!isMenuOpen)} src={menuIcon} alt="menu icon" className={`h-5 cursor-pointer invert`} />)
                }
            </div>
        </header>
    );
}

export default UserHeader;