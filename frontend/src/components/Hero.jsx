import { banner } from "../assets";
import { Container } from "./";
import { Link, useNavigate } from "react-router";
import { CheckCircle, CheckCircle2, CheckCircleIcon, Clock, FileText, Laptop, Phone, Shield, Video } from "lucide-react";

function Hero() {
    const navigate = useNavigate();

    return (
        <section className="flex items-center justify-center min-h-screen relative max-w-full overflow-x-hidden pt-32 md:pt-24 pb-14 md:pb-5 bg-left md:bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url('${banner}')` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50" />
            <Container className="flex flex-col gap-12 lg:gap-20 z-10 w-full h-full">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-16 lg:gap-20 w-full">
                    <div className="lg:w-2/3 xl:w-3/5 w-full px-2 flex flex-col items-start justify-between gap-5">
                        <p className={`inline-flex items-center gap-1 bg-white text-blue-950 px-4 py-2 rounded-full text-sm font-medium`}>
                            <Shield size={24} strokeWidth={1.5} />

                            Highly Trusted by Law Applicants
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">Craft Your Path to <span className="text-blue-600 text-shadow-sm">Law School Success</span></h1>
                        <p className="text-lg text-white z-40 leading-relaxed">Personalized 1-on-1 consultations to strengthen your law school applications for non-T14 schools. Expert guidance on personal statements and addendums to make your application stand out.</p>

                        <div className="flex gap-4 flex-wrap">
                            <Link to='/contact' className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                                <Video size={24} strokeWidth={1.5} />

                                <span>Book Consultation</span>
                            </Link>

                            <Link to='#contact' className={`inline-flex items-center justify-center gap-1 whitespace-nowrap h-10 bg-white text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-4 font-semibold rounded-md transition-all duration-300 cursor-pointer`}>
                                <Phone size={18} strokeWidth={1.5} />
                                Contact Us
                            </Link>
                        </div>

                        <div className="flex gap-5 sm:gap-10 flex-wrap text-blue-500">
                            {/* Available 24/7 */}
                            <div className="flex items-center gap-1">
                                <Clock />
                                <h4 className="text-white">
                                    Available 24/7
                                </h4>
                            </div>

                            {/* Free Pickup & Delivery */}
                            <div className="flex items-center gap-1">
                                <Laptop />
                                <h4 className="text-white">
                                    Personalized 1-on-1 Guidance
                                </h4>
                            </div>

                            {/* Insurance Support */}
                            <div className="flex items-center gap-1">
                                <FileText />
                                <h4 className="text-white">
                                    Review & Feedback
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* <div className="w-full lg:w-1/2 h-full lg:h-96 xl:h-120 relative">
                        <div className="relative w-full max-w-md mx-auto shadow-xl shadow-gray-500">
                            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=600&amp;q=80" alt="Law student studying" className="w-full h-auto" />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-blue-950 mb-2">Why Choose Us?</h3>
                                    <ul className="text-blue-600 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <CheckCircleIcon size={20} />
                                            <span className="text-blue-950">Former admissions committee experience</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircleIcon size={20} />
                                            <span className="text-blue-950">Specialized in non-T14 school strategies</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircleIcon size={20} />
                                            <span className="text-blue-950">Personalized 1-on-1 attention</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>

            </Container>
        </section>
    );
}

export default Hero;