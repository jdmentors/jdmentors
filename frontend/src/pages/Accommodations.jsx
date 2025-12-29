import { Link, useNavigate } from "react-router";
import { CallToActionAccommodations, Container, Hero, HeroAccommodations } from "../components";
import { CalendarCheck, Check } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toggleShowUserAuthForm } from "../features/forms/UserAuthSlice";
import { accommodationMapping, applicationReview, clipboardIcon, documentationCoordination, strategyCall, submissionFollowThrough, supportIcon, unsupportIcon } from "../assets";

const steps = [
    {
        id: 1,
        title: "Strategy Call",
        subtitle: "(30 minutes)",
        image: strategyCall,
        text: `We start with a private consultation where we learn how your condition actually affects your test-day performance. Timing issues, focus breakdowns, fatigue, panic, reading speed, memory, physical limitations. This is not a diagnosis call. It's a strategy call.`,
    },
    {
        id: 2,
        title: "Accommodation Mapping",
        image: accommodationMapping,
        text: `Based on your symptoms and testing history, we determine which accommodations you should request and which ones are realistically approvable under LSAC standards. Extra time, stop-the-clock breaks, screen readers, separate testing rooms, assistive tech, etc.`,
    },
    {
        id: 3,
        title: "Documentation Coordination",
        image: documentationCoordination,
        text: `We guide you on exactly what your provider needs to write, how it should be framed, and what LSAC actually looks for. If revisions are needed, we help you request them. No guesswork. No generic letters.`,
    },
    {
        id: 4,
        title: "Application Review",
        image: applicationReview,
        text: `We review every piece of your submission before it's sent. Forms, statements, documentation. We make sure it's complete, consistent, and defensible.`,
    },
    {
        id: 5,
        title: "Submission & Follow-Through",
        image: submissionFollowThrough,
        text: `We stay with you through submission and responses. If LSAC asks follow-ups or clarification, we help you respond.`,
    },
];

function Accommodations() {
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

    const dispatch = useDispatch();
    const isUserLoggedIn = useSelector(state => state.user.isUserLoggedIn);
    const navigate = useNavigate();

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

    return (
        <div className="min-h-[70vh] bg-blue-100">
            <HeroAccommodations />

            {/* Accommodations eligibility */}
            {/* <section className="my-16">
                <Container className={`grid md:grid-cols-3 items-center gap-8 lg:gap-10 xl:gap-14`}>
                    <div className="bg-blue-600 text-white md:col-span-1 rounded-2xl px-5 py-8 lg:p-8 drop-shadow-xl drop-shadow-blue-200">
                        <h2 className="text-3xl md:text-4xl underline mb-5 font-semibold">
                            Eligibility
                        </h2>
                        <div className="flex flex-col gap-5">
                            <p>To receive disability accommodations on the LSAT, students must meet certain eligibility requirements. These standards ensure that accommodations are applied fairly and appropriately.</p>

                            <ul className="flex flex-col gap-5 list-decimal list-inside">
                                <li>The student must have a physical, visual, or mental impairment that substantially limits one or more major life functions.</li>

                                <li>The student must submit valid documentation of the disability from a qualified professional, such as a licensed healthcare provider.</li>

                                <li>The disability must meaningfully impact the student’s ability to take the LSAT under standard testing conditions.</li>
                            </ul>

                            <p>Only applicants who meet these criteria and provide valid documentation of a qualifying disability are eligible for accommodation services.</p>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-600">Disability Accommodations</h2>
                            <p className="font-semibold text-blue-950">Undergraduate | LSAT Prep | GRE Prep | Law & Graduate Programs | MPRE & Bar Exam</p>
                        </div>

                        <ul className="flex flex-col gap-2 list-disc list-inside">
                            <li>Comprehensive Initial Consultation:
                                We begin by carefully reviewing all potential accommodations related to your disability and anticipated test-day challenges. From there, we recommend the strategies and accommodations most likely to support your specific needs.</li>

                            <li>Personalized Step-by-Step Guidance
                                Throughout the process, we provide ongoing support via email—helping you navigate each stage, from coordinating with your qualified professional to ensuring the necessary documentation of your disability is gathered and properly prepared.</li>

                            <li>Document Preparation & Submission Assistance:
                                We supply clear, detailed instructions for compiling and submitting paperwork to LSAC or other relevant offices. Before submission, we review and “clear” your materials to confirm that every requirement is satisfied.
                            </li>

                            <li>Structured Timeline Management:
                                In most cases, the process can be completed in about one week, provided your professional responds promptly. Timelines may extend if your provider requires additional protocols for releasing or verifying medical records, and we help you manage these steps efficiently.
                            </li>

                            <li>Proven Track Record of Success:
                                Our approach has resulted in a 100% success rate for eligible students requesting accommodations from the Law School Admission Council, college disability offices, and graduate or law school disability services.
                            </li>

                            <li>Confidentiality and Professional Care:
                                All information you share with us is handled with the utmost discretion. We maintain strict confidentiality throughout the process to protect your privacy while ensuring your request is presented with maximum effectiveness.
                            </li>
                        </ul>

                        <button onClick={handleClick} className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 md:self-start self-center cursor-pointer">
                            <CalendarCheck size={24} strokeWidth={1.5} />

                            <span>Schedule A Consultation</span>
                        </button>
                    </div>
                </Container>
            </section> */}

            <Container>
                <div className="max-w-full mt-16">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4 underline">Eligibility</h1>
                        <div className="space-y-3 text-gray-700">
                            <p className="text-lg leading-tight">
                                Most students don't know if they qualify. That's normal. Eligibility isn't about labels.
                            </p>
                            <p className="text-lg leading-tight">
                                It's about how your condition affects your testing.
                            </p>
                        </div>
                    </div>

                    {/* Criteria List Section */}
                    <div className="bg-gray-50 rounded-2xl mb-8 shadow-xl shadow-blue-200">
                        <div className="space-y- p-6">
                            {/* Criteria 1 */}
                            <div className="flex items-start bg-blue-100 p-3 rounded-xl">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <div>
                                    <p className="text-gray-800 text-lg leading-relaxed">
                                        <span className="font-semibold">The student</span> must have a <span className="font-semibold text-blue-600">physical, visual, or mental impairment</span> that substantially limits one or more major life functions.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start">
                                <div>
                                    {/* Criteria 2 */}
                                    <div className="flex items-start p-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                                            <span className="text-white font-bold">2</span>
                                        </div>
                                        <div>
                                            <p className="text-gray-800 text-lg leading-relaxed">
                                                The student must <span className="font-semibold">submit</span> <span className="font-semibold text-blue-600">valid documentation</span> of the disability from a qualified professional, such as a licensed healthcare provider.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Criteria 3 */}
                                    <div className="flex items-start p-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                                            <span className="text-white font-bold">3</span>
                                        </div>
                                        <div>
                                            <p className="text-gray-800 text-lg leading-relaxed">
                                                The disability must meaningfully impact the student's ability to take the LSAT under standard testing conditions.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <img src={clipboardIcon} alt="clipboard icon" className="h-42 mix-blend-multiply object-cover" />
                            </div>
                        </div>
                        <p className="text-gray-700 bg-blue-50 py-4 px-6 font-light rounded-b-2xl">
                            Only applicants who meet these criteria and provide valid documentation of a qualifying disability are eligible for accommodation services.
                        </p>
                    </div>
                </div>
            </Container>

            <Container>
                <section className="relative w-full mt-12 mb-16">
                    <div className="max-w-full text-center">

                        {/* Heading */}
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            What Your <span className="text-blue-600">Provider</span> Does vs. What We Do
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                            Understanding our distinct roles in the LSAT accommodations process.
                        </p>

                        {/* Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 shadow-xl shadow-blue-200 gap-5 rounded-xl">

                            {/* Provider Card */}
                            <div className="bg-white rounded-xl p-10 text-left relative">
                                <div className="flex flex-col justify-center items-center mb-5">
                                    <img
                                        src={unsupportIcon}
                                        alt="Your Provider"
                                        className="h-36 mix-blend-multiply absolute -top-8"
                                    />
                                    <h3 className="text-2xl font-semibold text-gray-800 mt-12">
                                        Your Provider
                                    </h3>
                                </div>

                                <ul className="space-y-5 text-base">
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 text-xl" />
                                        <span className="text-gray-700">
                                            Diagnoses or confirms condition
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 text-xl min-w-min" />
                                        <span className="text-gray-700">
                                            Writes medical documentation
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 text-xl min-w-min" />
                                        <span className="text-gray-700">
                                            Treats symptoms
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* JD Mentors Card */}
                            <div className="bg-blue-50 rounded-xl p-10 text-left relative">
                                <div className="flex flex-col justify-center items-center mb-5">
                                    <img
                                        src={supportIcon}
                                        alt="JD Mentors"
                                        className="h-36 mix-blend-multiply absolute -top-8"
                                    />
                                    <h3 className="text-2xl font-semibold text-gray-800 mt-12">
                                        JD Mentors
                                    </h3>
                                </div>

                                <ul className="space-y-5 text-base">
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 text-xl min-w-min" />
                                        <span className="text-gray-700">
                                            Translates symptoms into approvable accommodations
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 text-xl min-w-min" />
                                        <span className="text-gray-700">
                                            Ensures documentation meets LSAC standards
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 text-xl min-w-min" />
                                        <span className="text-gray-700">
                                            Identifies weak points before submission
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 text-xl min-w-min" />
                                        <span className="text-gray-700">
                                            Prevents denials based on technicalities
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 text-xl min-w-min" />
                                        <span className="text-gray-700">
                                            Handles strategy, framing, and timing
                                        </span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </section>
            </Container>

            <Container>
                <section className="relative mb-16">
                    <div className="max-w-full mx-auto text-center">

                        {/* Heading */}
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            How <span className="text-blue-600">JD Mentors</span> Gets You Approved
                        </h2>
                        <p className="text-gray-600 max-w-3xl mx-auto mb-16">
                            We guide you through every step of the LSAT accommodations process.
                        </p>

                        {/* Steps */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    className="relative bg-white rounded-2xl border-2 border-blue-600 px-6 pt-16 pb-10 shadow-lg text-left"
                                >
                                    {/* Number Bubble */}
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                            {step.id}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-semibold text-gray-800 text-center mb-1">
                                        {step.title}
                                    </h3>
                                    {step.subtitle && (
                                        <p className="text-center text-sm text-gray-600 mb-">
                                            {step.subtitle}
                                        </p>
                                    )}

                                    {/* Image */}
                                    <div className="flex justify-center mb-">
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className="h-28 object-contain mix-blend-multiply"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Text */}
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {step.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>
            </Container>

            <section className="my-16">
                <Container>
                    <div className="bg-white border border-blue-50 rounded-2xl p-8 md:p-10 xl:py-10 xl:px-20 [box-shadow:0_10px_40px_-12px_rgba(147,197,253,0.7),0_-10px_40px_-12px_rgba(147,197,253,0.7)]">
                        <p className="text-blue-950 font-semibold text-lg mb-3">Potential Disabilities That May Require Accommodations:</p>
                        <ul className="text-blue-600 list-decimal list-inside font-semibold flex flex-col flex-wrap md:max-h-[160px] lg:max-h-[160px] gap-2">
                            <li>Autism Spectrum Disorder (ASD)</li>
                            <li>Visual Impairments or Blindness</li>
                            <li>Hearing Impairments or Deafness</li>
                            <li>Physical or Mobility Challenges</li>
                            <li>Chronic Medical Conditions (e.g., Diabetes, Epilepsy)</li>
                            <li>Traumatic Brain Injuries</li>
                            <li>Speech or Communication Disorders</li>
                            <li>Learning Disabilities</li>
                            <li>Mental Health Conditions (e.g., Bipolar Disorder)</li>
                            <li>Chronic Pain Conditions</li>
                        </ul>
                    </div>
                </Container>
            </section>

            <CallToActionAccommodations />
        </div>
    );
}

export default Accommodations;