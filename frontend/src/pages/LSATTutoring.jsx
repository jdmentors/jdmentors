import { Link, useNavigate } from "react-router";
import { CallToActionLSATTutoring, Container, HeroLSATTutoring, HowItWorksCard, LoadingSpinner } from "../components";
import { BadgeDollarSignIcon, BookOpen, Brain, CalendarCheck, Clock, Handshake, LaptopMinimalCheck, TrendingUp, Users } from "lucide-react";
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
        name: 'Allan A.',
        review: `JD Mentors has amazing tutors. Working with Ronnie has genuinely been one of the best academic decisions I’ve made. From day one, he broke down concepts in a way that actually clicked with me. My score jumped more than I ever thought possible, and I owe a lot of it to him. If you want a tutor who gets results and explains things clearly, couldn’t recommend him more. Thank you Ronnie and JD Mentors!`,
        school: 'A 22-Point Increase That Changed My Future!',
    },
    {
        name: 'Daniel M.',
        review: `Thanks to the tutors at JD Mentors I have been able to see drastic improvements in my problem solving abilities aswell as my time management. Not only is my tutor helpful but he is charismatic and funny making every lesson with him super enjoyable. I don’t know who else to better recommend when it comes to improving on the LSATs.`,
        school: 'More Than a Tutor—A Strategic Partner.',
    },
    {
        name: 'Daniel Y.',
        review: `I really like my tutor, Ronnie. He knows and understand how to break down the problems. He explains each question type and makes it very easy to understand. He's patient, he helps you until you truly understand what you're learning. Thank you JD Mentors!!`,
        school: 'Thank you JD Mentors!!',
    },
    {
        name: 'Chloe K.',
        review: `I was terrified of the Logic Games section. My jdmentors tutor demystified them completely, providing a clear framework for every game type. The section went from my worst to my best, and it pushed my score to a 168. I'm heading to a T-14 school!`,
        school: 'Conquered My Biggest Fear on the LSAT.',
    },
    {
        name: 'Gabriel A.',
        review: `I had an amazing experience with JD Mentors.  Ronald, my tutor, really helped me break down all the question types and helped me understand the questions better. Also the prices for the classes were very affordable and I just couldn’t thank you enough Ronald. Ronald is the best out there!`,
        school: 'The Accountability and Guidance I Needed.',
    }
];

const HowItWorks = [
    {
        icon: <LaptopMinimalCheck />,
        title: 'Flexible Learning Formats',
        description: 'Choose the style that fits you best: intensive 1-on-1 private tutoring for a custom pace, or collaborative small-group sessions (2-5 students) to learn with peers.'
    },
    {
        icon: <TrendingUp />,
        title: 'Your Success Roadmap',
        description: 'We begin with a diagnostic assessment to build your personalized study plan. Whether you have one month or one year, we create a clear, step-by-step roadmap to your goal score.'
    },
    {
        icon: <BadgeDollarSignIcon />,
        title: 'Stress-Free Payment Options',
        description: 'We offer pay-as-you-go flexibility and discounted package deals. We also provide payment plan options to make elite preparation accessible.'
    },
    {
        icon: <Handshake />,
        title: 'Your Perfect Tutor Match',
        description: `You can choose your own tutor or let us pick the best match for you. Every plan comes with flexible scheduling and a setup built around how you learn and when you're available.`
    }
];

function LSATTutoring() {
    const [price, setPrice] = useState(null);
    const [selectedGroupSize, setSelectedGroupSize] = useState(4);
    const [pricing, setPricing] = useState(null);
    const [loadingPricing, setLoadingPricing] = useState(true);

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

    // Fetch pricing
    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/pricing`);
                if (data && data.success) {
                    setPricing(data.data);
                }
            } catch (error) {
                console.error('Error fetching pricing:', error);
                // Fallback to default pricing
                const defaultPricing = {
                    2: { perPerson: 70, total: 140 },
                    3: { perPerson: 65, total: 195 },
                    4: { perPerson: 60, total: 240 },
                    5: { perPerson: 55, total: 275 }
                };
                setPricing(defaultPricing);
            } finally {
                setLoadingPricing(false);
            }
        };
        fetchPricing();
    }, []);

    const groupSizeOptions = pricing ? [2, 3, 4, 5].map(size => ({
        size,
        price: pricing[size]?.perPerson || 0,
        total: pricing[size]?.total || 0,
        popular: size === 4 // Keep 4 as most popular, or adjust logic as needed
    })) : [
        { size: 2, price: 70, total: 140, popular: false },
        { size: 3, price: 65, total: 195, popular: false },
        { size: 4, price: 60, total: 240, popular: true },
        { size: 5, price: 55, total: 275, popular: false }
    ];

    return (
        <div className="min-h-[70vh]">
            <HeroLSATTutoring />

            {/* What to Expect in Your Lessons */}
            <section className="my-16">
                <Container className={`grid md:grid-cols-4 items-center gap-8 lg:gap-10 xl:gap-14`}>
                    <div className="md:col-span-2 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-600">What to Expect in Your Lessons</h2>
                            <p className="font-semibold text-blue-950">The JD Mentors advantage is simple: tutoring that fits you and moves your score.</p>
                        </div>

                        <ul className="flex flex-col gap-2 list-disc list-inside">
                            <li> <span className="font-medium">A plan that matches your timeline</span> -
                                Whether you’ve got a year or a few weeks, we build a schedule around your life. Sessions are flexible, so you see steady progress at your pace.</li>

                            <li> <span className="font-medium">Live lessons that actually feel personal</span> -
                                Your tutor pays attention to how you learn, gives you questions that target your weak spots, and breaks down the logic in a way that clicks. Study 1-on-1 or with a small group, whichever method helps you learn best.</li>

                            <li> <span className="font-medium">Targeted training in every LSAT section</span> -
                                We cover Logical Reasoning, Reading Comprehension, and the LSAT Essay with clear strategies that help you spot patterns and avoid the traps that slow most students down.
                            </li>

                            <li> <span className="font-medium">Guidance from a tutor in the 96th percentile who knows how to teach</span> -
                                You get the habits, shortcuts, and test day tactics strong scorers use, taught by someone who’s been in your shoes and knows how to guide you up the same hills.
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

            {/* Book group class session section */}
            <section className="my-16">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left Side - Class Session Information */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-blue-950 mb-4">
                                        Group LSAT Class Sessions
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        Study alongside a small group of your peers while a high-scoring tutor walks you through the LSAT step by step. You’ll learn from each other’s questions, swap strategies, and pick up new ways of approaching the logic and question types.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        Perfect for students who thrive in social learning settings and want to benefit from diverse perspectives while preparing for the LSAT.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <Users className="text-green-600" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Collaborative Learning</h4>
                                            <p className="text-gray-600 text-sm">Learn from peers and share insights</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <BookOpen className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Diverse Perspectives</h4>
                                            <p className="text-gray-600 text-sm">Exposure to different reasoning styles</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Brain className="text-purple-600" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Interactive Sessions</h4>
                                            <p className="text-gray-600 text-sm">Engaging group discussions and activities</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Choose your group size (2-5 students)</li>
                                        <li>• Get to learn with your peers</li>
                                        <li>• Schedule sessions at convenient times</li>
                                        <li>• Learn together with expert tutor guidance</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Group Size Selection & Booking */}
                        <div>
                            {/* <div className="mb-8">
                                <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
                                    Book Group Session
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    Choose your group size and start learning together
                                </p>
                            </div> */}

                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
                                <div className="space-y-5">
                                    {/* Group Size Selection */}
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-4 text-lg">Select Group Size</h4>
                                        {loadingPricing ? (
                                            <div className="flex justify-center items-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4">
                                                {groupSizeOptions.map((option) => (
                                                    <label
                                                        key={option.size}
                                                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${selectedGroupSize === option.size
                                                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                                : option.popular && selectedGroupSize !== option.size
                                                                    ? 'border-blue-300 bg-blue-25'
                                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                                                            }`}
                                                        onClick={() => setSelectedGroupSize(option.size)}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="groupSize"
                                                            value={option.size}
                                                            className="sr-only"
                                                            checked={selectedGroupSize === option.size}
                                                            onChange={() => setSelectedGroupSize(option.size)}
                                                        />
                                                        <div className="text-center">
                                                            <div className="flex items-center justify-center gap-1 mb-2">
                                                                <Users size={20} className="text-blue-600" />
                                                                <span className="font-bold text-lg text-blue-950">
                                                                    {option.size} Students
                                                                </span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-sm text-gray-600">
                                                                    ${option.price} per person
                                                                </p>
                                                                <p className="font-semibold text-green-600 text-lg">
                                                                    ${option.total} total
                                                                </p>
                                                            </div>
                                                            {option.popular && (
                                                                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                                    Most Popular
                                                                </span>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Pricing Summary */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-gray-800 mb-2">Session Includes:</h5>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>✓ A focused 90-minute group lesson built around mastering LSAT topics and questions</li>
                                            <li>✓ Guidance from a 96th-percentile+ tutors who knows how to teach</li>
                                            <li>✓ Targeted drills and walkthroughs that hit common weak spots</li>
                                            <li>✓ Clear takeaways and homework so you keep improving between sessions</li>
                                            {/* <li>✓ Flexible scheduling and easy rescheduling</li> */}
                                        </ul>
                                    </div>

                                    {/* Book Now Button */}
                                    <Link
                                        to={`/checkout/lsat-session?type=class&students=${selectedGroupSize}`}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl text-lg"
                                    >
                                        <CalendarCheck size={24} />
                                        <span>Book Group Session Now</span>
                                    </Link>

                                    {/* <div className="text-center">
                                        <p className="text-gray-500 text-sm">
                                            You'll select your exact date and time during checkout
                                        </p>
                                    </div> */}
                                </div>
                            </div>
                        </div>
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