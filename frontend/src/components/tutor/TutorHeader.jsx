import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { CalendarCheck, LayoutDashboard, Phone, User, Video } from "lucide-react";
import { useState } from "react";
import { closeMenu, darkLogo, menuIcon } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { showAuthForm } from "../../features/forms/UserAuthSlice";

function TutorHeader() {
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Contact', href: '/contact' },
        // { name: 'Testimonials', href: '/testimonials' },
    ];

    // const services = [
    //     { name: 'Admissions', href: '/services' },
    //     { name: 'Accommodations', href: '/accommodations' },
    // ];

    const isUserLoggedIn = useSelector(state => state.user.isUserLoggedIn);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();

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
                    <li>
                        {
                            isUserLoggedIn
                                ?
                                <Link to='/tutor/dashboard' className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                                    <LayoutDashboard size={24} strokeWidth={1.5} />

                                    <span>Dashboard</span>
                                </Link>
                                :
                                <button onClick={() => dispatch(showAuthForm('tutor'))} className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                    <User size={24} strokeWidth={1.5} />

                                    <span>Login</span>
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
                    <li>
                        {
                            isUserLoggedIn
                                ?
                                <Link to='/tutor/dashboard' className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                                    <LayoutDashboard size={24} strokeWidth={1.5} />

                                    <span>Dashboard</span>
                                </Link>
                                :
                                <button onClick={() => dispatch(showAuthForm('tutor'))} className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                    <User size={24} strokeWidth={1.5} />

                                    <span>Login</span>
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

export default TutorHeader;