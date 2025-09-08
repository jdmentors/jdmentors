import { CalendarCheck, Phone, Star } from "lucide-react";
import { Link } from "react-router";
import { AccommodationBanner } from "../assets";
import { Container } from "../components";
import { useEffect, useState } from "react";
import axios from "axios";

function HeroAccommodations() {
    const [accommodationPrice, setAccommodationPrice] = useState(null);

    useEffect(() => {
        const getAllOthers = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/all`);
                if (data && data.success) {
                    setAccommodationPrice(data.data[0].accommodationPrice);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getAllOthers();
    }, [])

    return (
        <section className="flex items-center justify-center min-h-screen relative max-w-full overflow-x-hidden pt-32 md:pt-24 pb-14 md:pb-5 bg-left md:bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url('${AccommodationBanner}')` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50" />
            <Container className="flex flex-col gap-12 lg:gap-20 z-10 w-full h-full">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-16 lg:gap-20 w-full">
                    <div className="lg:w-2/3 xl:w-3/5 w-full px-2 flex flex-col items-start justify-between gap-5">
                        <p className={`inline-flex items-center gap-1 bg-white text-blue-950 px-4 py-2 rounded-full text-sm font-medium`}>
                            <Star size={20} strokeWidth={1.5} />

                            5-Star Rated by Students
                        </p>
                        <h1 className="text-3xl md:text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">LSAT & Law School <span className="text-blue-600 text-shadow-sm">Accommodations</span></h1>

                        <p className="text-lg md:text-xl text-white z-40 leading-relaxed">We support and empower students with cognitive, physical, and mental health challenges by providing advocacy and guidance, ensuring you can fully focus on your LSAT exam and future goals.</p>

                        <div className="flex gap-4 flex-wrap">
                            <Link to='/checkout/accommodations' className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                                <CalendarCheck size={24} strokeWidth={1.5} />

                                <span>Book Now @ ${accommodationPrice}</span>
                            </Link>

                            <Link to='/contact' className={`inline-flex items-center justify-center gap-1 whitespace-nowrap h-10 bg-white text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-4 font-semibold rounded-md transition-all duration-300 cursor-pointer`}>
                                <Phone size={18} strokeWidth={1.5} />
                                Contact Us
                            </Link>
                        </div>

                        <p className="text-white z-40 leading-relaxed text-sm">* Get the support you deserve to succeed at every step of your law journey — from the LSAT, GRE, MPRE, Grad school, and admissions to law school exams, interviews, and the bar.</p>
                    </div>
                </div>

            </Container>
        </section>
    );
}

export default HeroAccommodations;