import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { Container } from "./";
import { useEffect, useState } from "react";
import { closeMenu, darkLogo, menuIcon } from "../assets";
import { LayoutDashboard, Phone, Video } from 'lucide-react';
import { logo } from "../assets";
import { useSelector } from "react-redux";

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();
    const isUserLoggedIn = useSelector(state => state.user.isUserLoggedIn);
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Blogs', href: '/blogs' },
        // { name: 'Testimonials', href: '/testimonials' },
        { name: 'Contact', href: '/contact' },
        { name: 'Services', href: '/services' },
    ];

    // const services = [
    //     { name: 'Core Services', href: '/services' },
    //     { name: 'Packages', href: '/packages' },
    //     { name: 'Add-ons', href: '/addons' },
    //     { name: 'Extras', href: '/extras' },
    // ];

    const bookConsultationHandler = () => {
        try {
            navigate('/services');
            scrollTo({top: 500, behavior: 'smooth'});
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        }

        setIsScrolled(pathname !== '/');

        pathname === '/' && window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname])
    return (
        <header className="w-full fixed top-0 left-0 z-40">
            <Container className={`flex items-center justify-between py-5 ${isScrolled && 'shadow-lg bg-white'}`}>
                <Link to='/' className="flex gap-2 z-50">
                    <img src={(isScrolled || isMenuOpen) ? darkLogo : logo} alt="logo" className="h-10" />
                </Link>

                <nav className="hidden lg:block">
                    <ul className="flex items-center gap-7">
                        {
                            navLinks.map(link => (
                                <li className="relative py-1" key={link.name}>
                                    <NavLink className={({ isActive }) => `${(isActive && isScrolled) ? 'text-blue-600 after:bg-blue-600' : isActive ? 'text-blue-600 after:bg-blue-600' : isScrolled ? 'text-blue-950 after:bg-blue-950' : 'text-white after:bg-white'} after:w-0 after:rounded after:h-0.5 after:absolute after:bottom-0 after:left-0 after:content-[""] hover:after:w-full after:transition-all after:duration-150`} to={link.href}>{link.name}</NavLink>
                                </li>
                            ))
                        }
                        {/* <li className="flex items-center relative" onClick={() => setIsOpen(!isOpen)}>
                            <Link className={`${isScrolled ? 'text-blue-950 after:bg-blue-950' : 'text-white'}`}>Services</Link>

                            <svg className={`w-5 h-5 inline float-right transition-transform cursor-pointer duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={`${isScrolled ? '#172554' : '#fff'}`} >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>

                            {isOpen && (
                                <ul onClick={() => setIsOpen(false)} className="w-36 bg-white border border-gray-300 rounded shadow-md mt-1 py-2 absolute top-7">
                                    {services.map((service) => (
                                        <li key={service.name} className="px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer" >
                                            <Link className="block" to={service.href}>{service.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li> */}
                        <li>
                            {
                                isUserLoggedIn
                                    ?
                                    <Link to='/user/dashboard' className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                                        <LayoutDashboard size={24} strokeWidth={1.5} />

                                        <span>Dashboard</span>
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
                                <li onClick={() => setIsMenuOpen(false)} key={link.name} className="relative mx-5 py-2">
                                    <NavLink className={({ isActive }) => `${isActive ? 'text-blue-600 after:bg-blue-600' : 'text-blue-950 after:bg-blue-950'} after:w-0 after:rounded after:h-0.5 after:absolute after:bottom-0 after:left-0 after:content-[""] hover:after:w-full after:transition-all after:duration-150`} to={link.href}>{link.name}</NavLink>
                                </li>
                            ))
                        }
                        {/* <li className="flex items-center justify-center relative mx-5 py-2" onClick={() => setIsOpen(!isOpen)}>
                            <Link className={`text-blue-950 after:bg-blue-950`}>Services</Link>

                            <svg className={`w-5 h-5 inline float-right transition-transform cursor-pointer duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={`#172554`} >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>

                            {isOpen && (
                                <ul onClick={() => {setIsOpen(false); setIsMenuOpen(false);}} className="w-36 bg-white border border-gray-300 rounded shadow-md mt-1 py-2 absolute top-7">
                                    {services.map((service) => (
                                        <li key={service.name} className="px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer" >
                                            <Link className="block" to={service.href}>{service.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li> */}
                        {
                            isUserLoggedIn
                            &&
                            <li onClick={() => setIsMenuOpen(false)} className="py-2">
                                <Link to='/user/dashboard' className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                                    <LayoutDashboard size={24} strokeWidth={1.5} />

                                    <span>Dashboard</span>
                                </Link>
                            </li>
                        }
                        <li onClick={() => setIsMenuOpen(false)} className="py-2">
                            <Link to='tel:+13476992020' className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                                <Phone size={18} />

                                (347) 699-2020
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="lg:hidden z-50 flex items-center gap-5">
                    {
                        isMenuOpen ? (<img onClick={() => setIsMenuOpen(!isMenuOpen)} src={closeMenu} alt="menu icon" className={`h-7 cursor-pointer invert-25 z-50 ${isScrolled}`} />) : (<img onClick={() => setIsMenuOpen(!isMenuOpen)} src={menuIcon} alt="menu icon" className={`h-5 cursor-pointer ${isScrolled && 'invert'}`} />)
                    }
                </div>
            </Container>
        </header>
    );
}

export default Header;