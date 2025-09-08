import { Link } from "react-router";
import { CallToActionAccommodations, Container, Hero, HeroAccommodations } from "../components";
import { CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

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
                            <p>To qualify for disability accommodations on the LSAT, a student must meet the following requirements:</p>

                            <ul className="flex flex-col gap-5 list-decimal list-inside">
                                <li>The student must have a physical, visual, or mental impairment that substantially limits one or more major life functions.</li>

                                <li>The student must submit valid documentation of the disability from a qualified professional, such as a licensed healthcare provider.</li>

                                <li>The disability must meaningfully impact the student’s ability to take the LSAT under standard testing conditions.</li>
                            </ul>

                            <p>Students who do not meet these criteria will not be eligible for our accommodation services.</p>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-600">Disability Accommodations: ${accommodationPrice}</h2>
                            <p className="font-semibold text-blue-950">Undergraduate | LSAT Prep | GRE Prep | Praxis Exams | Law & Graduate Programs | MPRE & Bar Exam</p>
                        </div>

                        <ul className="flex flex-col gap-2 list-disc list-inside">
                            <li>Initial Consultation: We start by reviewing all reasonable accommodations for your disability and test-day challenges, then recommend the options that will best support your needs.</li>

                            <li>Practice Assignments: We provide exercises to help you use your accommodations effectively, so you can manage your symptoms confidently on test day.</li>

                            <li>Step-by-Step Guidance: Through email, we guide you through each stage of the process, including coordinating with your qualified professional to gather documentation of your disability.</li>

                            <li>Document Submission Support: We provide clear instructions for submitting your paperwork to LSAC (or other relevant offices) and “clear” your submission once everything meets our final approval.</li>

                            <li>Free Resources: You’ll receive a complimentary copy of our Logical Reasoning ebook, packed with strategies to manage test anxiety, maintain mental clarity, and sharpen logical reasoning skills during the exam.</li>

                            <li>Timeline: The process usually takes about a week if your professional responds promptly, though it may take longer if your provider has specific protocols for sharing medical records.</li>

                            <li>Proven Success: We have a 100% success rate helping eligible students submit accommodation requests to the Law School Admission Council, college disability offices, and graduate/law school disability services.</li>
                        </ul>

                        <Link to='/checkout/accommodations' className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 md:self-start self-center">
                            <CalendarCheck size={24} strokeWidth={1.5} />

                            <span>Book Now @ ${accommodationPrice}</span>
                        </Link>
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