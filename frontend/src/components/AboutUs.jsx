import { ChartColumnIncreasing, GraduationCap, University } from "lucide-react";
import { aboutUs } from "../assets";
import { Container } from "./";

function AboutUs() {
    return (
        <section className="mt-14 md:mt-18">
            <Container>
                <div className="grid md:grid-cols-5 lg:grid-cols-8 gap-8 md:gap-16 items-end justify-between">
                    <div className="relative md:col-span-2 lg:col-span-3">
                        <img src={aboutUs} loading="lazy" alt="aboutUs" className="rounded-md shadow-2xl shadow-blue-200 w-full max-h-60 sm:max-h-96 md:h-120 lg:max-h-110 object-cover" />
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg shadow-blue-200 hidden sm:block">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">100+</div>
                                <div className="text-sm text-gray-500">
                                    Schools Represented
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-3 lg:col-span-5">
                        <h2 className="text-3xl font-bold text-blue-950 mb-6">
                            About Our Expertise
                        </h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">With years of experience in law school admissions consulting, We specialize in helping students craft compelling applications for non-T14 schools.</p>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <University className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-950 mb-2">
                                        Admissions Insight
                                    </h3>
                                    <p className="text-gray-600">
                                        Former experience on admissions committees provides unique perspective on what schools look for in applicants.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <GraduationCap className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-950 mb-2">
                                        Student-Centered Approach
                                    </h3>
                                    <p className="text-gray-600">
                                        Every consultation is tailored to your specific background, goals, and application needs.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ChartColumnIncreasing className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-950 mb-2">
                                        Proven Results
                                    </h3>
                                    <p className="text-gray-600">
                                        Our students consistently gain admission to their target schools with stronger applications than they could have created alone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default AboutUs;