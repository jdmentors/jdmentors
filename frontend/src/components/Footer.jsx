import { Link, NavLink } from "react-router";
import Container from "./Container";
import { logo } from "../assets";
import { Instagram, Mail, Phone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { showAuthForm } from "../features/forms/UserAuthSlice";


function Footer() {
    const quickLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Blogs', href: '/blogs' },
        // { name: 'Testimonials', href: '/testimonials' },
        { name: 'Check Session Status', href: '/session-status' },
    ];

    const legalPolicies = [
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms & Conditions', href: '/terms-conditions' },
    ];

    // const services = [
    //     { name: 'All-In-One Solutions', href: '/services' },
    //     { name: 'Focused Support', href: '/services' },
    //     { name: 'Beyond the Application', href: '/services' },
    //     { name: 'Others', href: '/services' },
    // ];

    const services = [
        { name: 'Admissions', href: '/services' },
        { name: 'Accommodations', href: '/accommodations' },
    ];

    const dispatch = useDispatch();

    const user = useSelector(state => state.user.user);

    return (
        <footer className="bg-gray-900 text-gray-200 font-light py-12">
            <Container className=' px-6 md:px-16 lg:px-24 xl:px-32'>
                <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                    <div className='max-w-80'>
                        <Link to='/' className="flex gap-2 z-50 mb-4">
                            <img src={logo} alt="logo" className="h-12" />
                        </Link>
                        <p className=''>
                            JD Mentors provides specialized law school application consulting for non-T14 schools. Personalized 1-on-1 sessions to craft compelling personal statements and effective addendums.
                        </p>
                        <div className='flex items-center gap-3 mt-4'>
                            {/* Instagram */}
                            <Link to="https://www.instagram.com/jd.mentors" target="_blank">
                                <Instagram strokeWidth={1.25} />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <p className='text-lg text-gray-300 font-semibold'>
                            Quick Links
                        </p>
                        <ul className='mt-3 flex flex-col gap-2 '>
                            {
                                quickLinks.map(link => (
                                    <li className="relative py-1" key={link.name}>
                                        <NavLink className={({ isActive }) => `text-white after:bg-white`} to={link.href}>{link.name}</NavLink>
                                    </li>
                                ))
                            }
                            {
                                (!user || Object.keys(user).length < 1)
                                &&
                                <li className="relative py-1">
                                    <button className="cursor-pointer hover:underline" onClick={() => dispatch(showAuthForm('tutor'))} >Tutor Login</button>
                                </li>
                            }
                        </ul>
                    </div>

                    <div>
                        <p className='text-lg text-gray-300 font-semibold'>
                            Services
                        </p>
                        <ul className='mt-3 flex flex-col gap-2 '>
                            {
                                services.map(service => (
                                    <li className="relative py-1" key={service.name}>
                                        <NavLink className={({ isActive }) => `text-white after:bg-white`} to={service.href}>{service.name}</NavLink>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                    <div>
                        <p className='text-lg text-gray-300 font-semibold'>
                            Legal Policies
                        </p>
                        <ul className='mt-3 flex flex-col gap-2 '>
                            {
                                legalPolicies.map(service => (
                                    <li key={service.name}>
                                        <Link to={service.href}>{service.name}</Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                    <div className='max-w-80'>
                        <p className='text-lg text-gray-300 font-semibold'>
                            Reach Out
                        </p>
                        <ul className='mt-3 flex flex-col gap-2'>
                            <li className="flex items-center gap-2">
                                <Phone size={18} />

                                <Link className="hover:underline" to='tel:+13476992020'>(347) 699-2020</Link>
                            </li>

                            <li className="flex items-center gap-2">
                                <Mail size={18} />

                                <Link className="hover:underline" to='mailto:contact@jdmentors.com'>contact@jdmentors.com</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className='border-gray-300 mt-8' />

                <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                    {/* <p>© {new Date().getFullYear()} &nbsp; */}
                    <p>
                        <Link to="/">
                            JD Mentors
                        </Link>
                        {/* &nbsp; All rights reserved. &nbsp; */}
                    </p>
                    <div className="flex flex-row gap-2 items-center">
                        <Link to={'/terms-conditions'}>Terms</Link>
                        <Link to={'/privacy-policy'}>Privacy</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;