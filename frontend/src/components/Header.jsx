import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { Container } from "./";
import { useEffect, useState } from "react";
import { closeMenu, darkLogo, menuIcon } from "../assets";
import { CalendarCheck, LayoutDashboard, Phone, Video } from 'lucide-react';
import { logo } from "../assets";
import { useDispatch, useSelector } from "react-redux";
import { toggleShowUserAuthForm } from "../features/forms/UserAuthSlice.js";

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();
    const isUserLoggedIn = useSelector(state => state.user.isUserLoggedIn);
    const userType = useSelector(state => state.user.user?.userType);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Blogs', href: '/blogs' },
        // { name: 'Testimonials', href: '/testimonials' },
        { name: 'Contact', href: '/contact' },
    ];

    const services = [
        { name: 'Admissions', href: '/services' },
        { name: 'Accommodations', href: '/accommodations' },
        { name: 'LSAT Tutoring', href: '/lsat-tutoring' },
    ];

    const bookConsultationHandler = () => {
        try {
            if (pathname === '/') {
                navigate('/services');
            }
            else if (pathname === '/lsat-tutoring') {
                navigate('/checkout/lsat-session?type=free')
            }
            else if (pathname === '/accommodations') {
                navigate('/checkout/accommodations')
            }
            setIsMenuOpen(false);
            scrollTo({ top: 500, behavior: 'smooth' });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        }

        setIsScrolled(pathname !== '/' && pathname !== '/accommodations' && pathname !== '/lsat-tutoring');

        pathname === '/' && window.addEventListener('scroll', handleScroll);
        pathname === '/accommodations' && window.addEventListener('scroll', handleScroll);
        pathname === '/lsat-tutoring' && window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname])

    useEffect(() => {
        const hideIsOpen = () => {
            setIsOpen(false);
        }

        window.addEventListener('click', hideIsOpen);
        return () => window.removeEventListener('click', hideIsOpen);
    }, [])

    const handleClick = () => {
        try {
            if (isUserLoggedIn) {
                navigate(`/checkout/accommodations`);
            } else {
                dispatch(toggleShowUserAuthForm(true));
                navigate(`/checkout/accommodations`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleIsOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
    }

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
                        <li className="flex items-center relative" onClick={(e) => handleIsOpen(e)}>
                            <Link className={`${isScrolled ? 'text-blue-950 after:bg-blue-950' : 'text-white'}`}>Pre Law</Link>

                            <svg className={`w-5 h-5 inline float-right transition-transform cursor-pointer duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={`${isScrolled ? '#172554' : '#fff'}`} >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>

                            {isOpen && (
                                <ul className="w-40 bg-white border border-white rounded shadow-md mt-2 absolute top-7">
                                    {services.map((service) => (
                                        <li
                                            key={service.name}
                                            className="hover:bg-blue-600 hover:text-white cursor-pointer"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Link className="px-4 py-2 block w-full h-full" to={service.href}>
                                                {service.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                        <li>
                            {
                                isUserLoggedIn
                                    ?
                                    <Link to={`${userType === 'tutor' ? '/tutor/dashboard' : userType === 'admin' ? '/admin/dashboard' : '/user/dashboard'}`} className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                                        <LayoutDashboard size={24} strokeWidth={1.5} />

                                        <span>Dashboard</span>
                                    </Link>
                                    :
                                    pathname === '/accommodations'
                                        ?
                                        <button onClick={handleClick} className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                            <CalendarCheck size={24} strokeWidth={1.5} />

                                            <span>Schedule A Consultation</span>
                                        </button>
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
                        <li className="flex items-center justify-center relative mx-5 py-2" onClick={(e) => handleIsOpen(e)}>
                            <Link className={`text-blue-950 after:bg-blue-950`}>Pre Law</Link>

                            <svg className={`w-5 h-5 inline float-right transition-transform cursor-pointer duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={`#172554`} >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>

                            {isOpen && (
                                <ul onClick={() => { setIsOpen(false); setIsMenuOpen(false); }} className="w-40 bg-white border border-gray-300 rounded shadow-md mt-2 absolute top-7">
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
                                        <button onClick={() => { setIsMenuOpen(false); handleClick() }} className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                            <CalendarCheck size={24} strokeWidth={1.5} />

                                            <span>Schedule A Consultation</span>
                                        </button>
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
                        isMenuOpen ? (<img onClick={() => setIsMenuOpen(!isMenuOpen)} src={closeMenu} alt="menu icon" className={`h-7 cursor-pointer invert-25 z-50 ${isScrolled}`} />) : (<img onClick={() => setIsMenuOpen(!isMenuOpen)} src={menuIcon} alt="menu icon" className={`h-5 cursor-pointer ${isScrolled && 'invert'}`} />)
                    }
                </div>
            </Container>
        </header>
    );
}

export default Header;