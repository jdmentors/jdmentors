import { Link, useNavigate } from "react-router";
import { CallToActionLSATTutoring, Container, HeroLSATTutoring, HowItWorksCard, LoadingSpinner } from "../components";
import { BadgeDollarSignIcon, CalendarCheck, Handshake, LaptopMinimalCheck, TrendingUp } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toggleShowUserAuthForm } from "../features/forms/UserAuthSlice";
import { lsatClass } from "../assets";
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

const Testimonial = lazy(() => import('../components/Testimonial'));
const LSATTutors = lazy(() => import('../components/LSATTutors'));
const AllLSATPackages = lazy(() => import('../components/AllLSATPackages'));

const testimonials = [
    {
        name: 'Mark T.',
        review: `My diagnostic was a 148, and I was feeling hopeless. jdmentors didn't just give me strategies; they gave me confidence. My tutor, Sarah, broke down complex concepts into manageable steps. On test day, I scored a 170! I truly couldn't have done it without them.`,
        school: 'A 22-Point Increase That Changed My Future!',
    },
    {
        name: 'Daniel M.',
        review: `Thanks to the tutors at JD Mentors I have been able to see drastic improvements in my problem solving abilities aswell as my time management. Not only is my tutor helpful but he is charismatic and funny making every lesson with him super enjoyable. I don’t know who else to better recommend when it comes to improving on the LSATs.`,
        school: 'More Than a Tutor—A Strategic Partner.',
    },
    {
        name: 'David L.',
        review: `As a full-time student, I needed a flexible and efficient study plan. jdmentors crafted a perfect schedule around my classes. The 1-on-1 Zoom sessions were so focused; we achieved in an hour what would have taken me weeks on my own. Jumped from a 155 to a 171!`,
        school: 'Maximum Efficiency for a Busy Student.',
    },
    {
        name: 'Chloe K.',
        review: `I was terrified of the Logic Games section. My jdmentors tutor demystified them completely, providing a clear framework for every game type. The section went from my worst to my best, and it pushed my score to a 168. I'm heading to a T-14 school!`,
        school: 'Conquered My Biggest Fear on the LSAT.',
    },
    {
        name: 'Jordan M.',
        review: `I tried self-studying with books and felt completely lost. Signing up with jdmentors was the best decision. Having an expert to answer my questions in real-time and keep me accountable made all the difference. My score improved by 15 points!`,
        school: 'The Accountability and Guidance I Needed.',
    }
];

const HowItWorks = [
    {
        icon: <LaptopMinimalCheck />,
        title: 'Flexible Learning Formats',
        description: 'Choose the style that fits you best: intensive 1-on-1 private tutoring for a custom pace, or collaborative small-group sessions (2-5 students) to learn with peers and split the cost.'
    },
    {
        icon: <TrendingUp />,
        title: 'Your Success Roadmap',
        description: 'We begin with a diagnostic assessment to build your personalized study plan. Whether you have one month or one year, we create a clear, step-by-step roadmap to your goal score.'
    },
    {
        icon: <BadgeDollarSignIcon />,
        title: 'Stress-Free Payment Options',
        description: 'We offer pay-as-you-go flexibility and discounted package deals. We also provide payment plans and need-based scholarships to make elite preparation accessible.'
    },
    {
        icon: <Handshake />,
        title: 'Hand Matched To Your Tutor',
        description: `We don't just assign you a tutor. We allow you to select your preferred mentor and the exact date and time that works for you—all during checkout.`
    }
];

function LSATTutoring() {
    const [price, setPrice] = useState(null);

    const timer = useRef();

    const [sliderRef] = useKeenSlider({
        loop: true,
        mode: "snap",
        slides: {
            perView: 4,
            spacing: 15,
        },
        breakpoints: {
            "(max-width: 1250px)": {
                slides: { perView: 3, spacing: 10 },
            },
            "(max-width: 1024px)": {
                slides: { perView: 2, spacing: 10 },
            },
            "(max-width: 640px)": {
                slides: { perView: 1, spacing: 8 },
            },
        },
        created(s) {
            startAutoplay(s);
        },
        dragStarted() {
            stopAutoplay();
        },
        animationEnded(s) {
            startAutoplay(s);
        },
        updated(s) {
            startAutoplay(s);
        },
    });

    function startAutoplay(slider) {
        stopAutoplay();
        timer.current = setInterval(() => {
            if (slider) slider.next();
        }, 1500);
    }

    function stopAutoplay() {
        clearInterval(timer.current);
    }

    useEffect(() => {
        const getAllOthers = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/all`);
                if (data && data.success) {
                    setPrice(data.data[0].price);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getAllOthers();
    }, [])

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
        <div className="min-h-[70vh]">
            <HeroLSATTutoring />

            {/* Why JD Mentors is different */}
            <section className="my-16">
                <Container className={`grid md:grid-cols-4 items-center gap-8 lg:gap-10 xl:gap-14`}>
                    <div className="md:col-span-2 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-600">What Makes JD Mentors Different?</h2>
                            <p className="font-semibold text-blue-950">The JD Mentors Advantage: Tailored Tutoring for Transformative Results.</p>
                        </div>

                        <ul className="flex flex-col gap-2 list-disc list-inside">
                            <li> <span className="font-medium">Your Plan, Your Pace</span> -
                                Whether you have six months or six weeks, we build a flexible study schedule that fits your life, with lessons available days, nights, and weekends.</li>

                            <li> <span className="font-medium">True One-on-One Attention</span> -
                                Every Zoom session is a dedicated partnership. Our tutors don't just teach a curriculum; they teach you, adapting to your unique learning style.</li>

                            <li> <span className="font-medium">Master Every Section</span> -
                                Gain confidence and mastery in Logical Reasoning, Reading Comprehension, and Analytical Reasoning with strategies that work for you.
                            </li>

                            <li> <span className="font-medium">Learn from the Best</span> -
                                Every jdmentors tutor is a top-scorer (175+) who is not only a test expert but also a trained mentor, equipped with the latest teaching methods.
                            </li>
                        </ul>

                        <div className="flex flex-wrap items-center gap-5">
                            <Link to={`/checkout/lsat-session?type=one-on-one`} className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 md:self-start self-center cursor-pointer">
                                <CalendarCheck size={24} strokeWidth={1.5} />

                                <span>Book 1-on-1 Session</span>
                            </Link>

                            <Link to={`/checkout/lsat-session?type=class`} className="inline-flex items-center justify-center gap-1 text-blue-600 hover:text-white transition-all duration-200 border border-blue-600 whitespace-nowrap rounded-md font-medium h-10 px-4 py-2 bg-white hover:bg-blue-700 md:self-start self-center cursor-pointer">
                                <CalendarCheck size={24} strokeWidth={1.5} />

                                <span>Book Class Session</span>
                            </Link>
                        </div>
                    </div>

                    <div className=" text-white md:col-span-2 rounded-2xl drop-shadow-xl drop-shadow-blue-200">
                        <img src={lsatClass} alt="lsat class" className="max-h-[500px] h-[500px] w-full object-cover rounded-2xl" />
                    </div>
                </Container>
            </section>

            <section className="my-16">
                <Container>
                    <div className="text-left mb-5">
                        <h1 className="text-4xl font-bold text-blue-950 mb-4">
                            LSAT Tutoring Packages
                        </h1>
                        <p className="text-gray-600">
                            Choose the perfect package for your LSAT preparation journey.
                            All packages include expert tutoring and flexible scheduling.
                        </p>
                    </div>

                    <Suspense fallback={<LoadingSpinner />}>
                        <AllLSATPackages />
                    </Suspense>
                </Container>
            </section>

            {/* Testimonials section */}
            <section className="mt-12 md:mt-16 mb-8">
                <Container>
                    <div>

                        <h2 className="text-3xl font-bold text-blue-950">Our LSAT Tutoring Success Stories</h2>
                        <p className="md:text-lg text-blue-950 my-3">From Aspiration to Acceptance: Stories from the JD Mentors Family.</p>

                        <Suspense fallback={<LoadingSpinner />}>
                            <div ref={sliderRef} className="keen-slider py-4">
                                {testimonials.map(testimonial => (
                                    <Testimonial
                                        key={testimonial.name}
                                        name={testimonial.name}
                                        school={testimonial.school}
                                        review={testimonial.review}
                                    />
                                ))}
                            </div>
                        </Suspense>

                    </div>
                </Container>
            </section>

            <Suspense fallback={<LoadingSpinner />}>
                <LSATTutors />
            </Suspense>

            <Container className={`my-16`}>
                <section className="bg-white">
                    <h5 className="font-semibold text-blue-600">Clear Options, Maximum Flexibility.</h5>
                    <h2 className="text-2xl md:text-3xl font-semibold my-5 text-blue-950">Designed For Your Convenience</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-8">
                        {
                            HowItWorks && HowItWorks.map(howItWork => {
                                return (
                                    <HowItWorksCard key={howItWork.title} icon={howItWork.icon} title={howItWork.title} description={howItWork.description} />
                                )
                            })
                        }
                    </div>
                </section>
            </Container>

            <CallToActionLSATTutoring />
        </div>
    );
}

export default LSATTutoring;