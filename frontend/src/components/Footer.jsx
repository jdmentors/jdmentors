import { Link, NavLink } from "react-router";
import Container from "./Container";
import { logo } from "../assets";
import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter } from "lucide-react";


function Footer() {
    const quickLinks = [
        { name: 'About', href: '/about' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Contact', href: '/contact' },
        { name: 'Testimonials', href: '/testimonials' },
    ];

    const ourServices = [
        { name: 'Personal Statement Review', href: '/services/personal-statement-review' },
        { name: 'Addendum Consultation', href: '/services/addendum-consultation' },
        { name: 'Application Strategy', href: '/services/application-strategy' },
        { name: 'Interview Preparation', href: '/services/interview-preparation' },
    ];

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
                                <Link to="/">
                                    <Instagram strokeWidth={1.25} />
                                </Link>

                                <Link to="/">
                                    <Facebook strokeWidth={1} />
                                </Link>

                                <Link to="/">
                                    <Linkedin strokeWidth={1} />
                                </Link>

                                <Link to="/">
                                    <Twitter strokeWidth={1}/>
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
                        </ul>
                    </div>

                    <div>
                        <p className='text-lg text-gray-300 font-semibold'>
                            Services
                        </p>
                        <ul className='mt-3 flex flex-col gap-2 '>
                            {
                                ourServices.map(service => (
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

                                <Link className="hover:underline" to='tel:+35799777281'>(+1)997842XXXX</Link>
                            </li>

                            <li className="flex items-center gap-2">
                                <Mail size={18} />

                                <Link className="hover:underline" to='mailto:support@jdmentors.com'>support@jdmentors.com</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr className='border-gray-300 mt-8' />
                <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                    <p>© {new Date().getFullYear()} &nbsp;
                        <Link to="/">
                        JD Mentors
                        </Link>. 
                        &nbsp; All rights reserved. &nbsp;
                    </p>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;