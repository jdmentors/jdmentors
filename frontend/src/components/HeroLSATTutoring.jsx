import { CalendarCheck, Phone, Star } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { lsatTutoring } from "../assets";
import { Container } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { toggleShowUserAuthForm } from "../features/forms/UserAuthSlice";

function HeroLSATTutoring() {
    const dispatch = useDispatch();
    const isUserLoggedIn = useSelector(state => state.user.isUserLoggedIn);
    const navigate = useNavigate();

    const handleClick = () => {
        try {
            if (isUserLoggedIn) {
                navigate(`/checkout/lsat-session?type=one-on-one`);
            } else {
                dispatch(toggleShowUserAuthForm(true));
                navigate(`/checkout/lsat-session?type=one-on-one`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <section className="flex items-center justify-center min-h-screen relative max-w-full overflow-x-hidden pt-32 md:pt-24 pb-14 md:pb-5 bg-left bg-cover bg-no-repeat" style={{ backgroundImage: `url('${lsatTutoring}')` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50" />
            <Container className="flex flex-col gap-12 lg:gap-20 z-10 w-full h-full">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-16 lg:gap-20 w-full">
                    <div className="lg:w-2/3 xl:w-3/5 w-full px-2 flex flex-col items-start justify-between gap-5">
                        <p className={`inline-flex items-center gap-1 bg-white text-blue-950 px-4 py-2 rounded-full text-sm font-medium`}>
                            <Star size={20} strokeWidth={1.5} />

                            Your LSAT Success Starts Here
                        </p>
                        <h1 className="text-3xl md:text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">Earn Your Highest Possible <span className="text-blue-600 text-shadow-sm">LSAT Score</span></h1>

                        <p className="text-lg md:text-xl text-white z-40 leading-relaxed">Work with a tutor who understands how you think and shows you exactly what you need to master the LSAT.</p>

                        <div className="flex gap-4 flex-wrap">
                            <button onClick={handleClick} className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                <CalendarCheck size={24} strokeWidth={1.5} />

                                <span>Book 1-on-1 Session</span>
                            </button>

                            <Link to='/checkout/lsat-session?type=free' className={`inline-flex items-center justify-center gap-1 whitespace-nowrap h-10 bg-white text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-4 font-semibold rounded-md transition-all duration-300 cursor-pointer`}>
                                <CalendarCheck size={18} strokeWidth={1.5} />
                                 Book A Free Consultation
                            </Link>
                        </div>

                        <p className="text-white z-40 leading-relaxed text-sm">* Don't just take the LSAT—conquer it. Join all the future lawyers who've unlocked their full potential with personalized, 1-on-1 LSAT tutoring from JD Mentors.</p>
                    </div>
                </div>

            </Container>
        </section>
    );
}

export default HeroLSATTutoring;