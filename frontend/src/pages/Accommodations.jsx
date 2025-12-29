import { Link, useNavigate } from "react-router";
import { CallToActionAccommodations, Container, Hero, HeroAccommodations } from "../components";
import { CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toggleShowUserAuthForm } from "../features/forms/UserAuthSlice";

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
        <div className="min-h-[70vh]">
            <HeroAccommodations />

            {/* Accommodations eligibility */}
            <section className="my-16">
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
            </section>

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