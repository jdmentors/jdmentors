import { Link } from "react-router";
import { aboutUs, omar } from "../assets";
import { CallToAction, Container } from "../components";
import { Shield, Video } from "lucide-react";

function SingleBlog() {
    return (
        <section className="mt-24 md:mt-32 mb-12">
            <Container className="grid gap-10 items-start">
                <section className="">
                    <h1 className="text-3xl md:text-4xl font-semibold my-5 text-blue-950">Why Your Personal Statement Matters More Than You Think</h1>

                    <div className="my-5 text-gray-600 flex gap-5 items-center text-sm">
                        <div className="inline-flex gap-3 items-center font-semibold">
                            <img src={omar} alt="author" className="h-10 w-10 object-cover rounded-full border border-blue-200" />
                            <p><Link to="/blogs">Alan Parker</Link></p>
                        </div>

                        <p>July 29, 2025</p>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:gap-10 items-start">

                        <div>
                            <img src={aboutUs} alt="postImage" className="w-full h-60 sm:h-96 lg:h-105 xl:h-120 object-cover rounded-xl" />

                            <div className="my-8 text-gray-700">
                                When it comes to law school admissions, your personal statement isn’t just another requirement—it’s your voice.

                                <br /><br />

                                Admissions committees at non-T14 schools often evaluate more than just your GPA or LSAT score. They want to understand your motivations, your resilience, and what sets you apart. That’s exactly where your personal statement plays a key role.

                                <br /><br />

                                <strong>A compelling personal statement can:</strong>

                                <ol className="list-inside list-decimal">
                                    <li>Showcase your unique story beyond numbers and transcripts</li>
                                    <li>Explain academic or personal challenges in a meaningful way</li>
                                    <li>Demonstrate fit with the values and mission of your target schools</li>
                                </ol>

                                <br />

                                Our consultants work with you 1-on-1 to uncover the narrative threads that make your story powerful and personal. From brainstorming to the final draft, we guide you every step of the way—helping you craft a statement that not only meets expectations but exceeds them.

                                <br /><br />

                                If you’re serious about standing out, your personal statement isn’t where you cut corners—it’s where you shine.
                            </div>
                        </div>

                        <section className="rounded-xl overflow-hidden bg-blue-100 text-blue-950 sticky top-20 shadow-lg shadow-blue-200">
                            <div className="flex flex-col items-center justify-center text-center p-6.5 ">
                                <div className="flex items-center justify-center bg-white px-3 py-1.5 shadow gap-1 rounded-full text-xs">
                                    <Shield size={18} className="text-blue-950" />
                                    <span className="text-blue-950">
                                        Trusted by Law Applicants
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-medium my-3">
                                    Your Law School Journey Starts Here
                                    <br />
                                    — Stand Out in Your Application
                                </h2>
                                <p className="text-gray-600 mt-2 max-w-5xl max-md:text-sm">
                                    Book a personalized consultation and get insider strategies to elevate your application — from essays to final submission.
                                </p>

                                <div className="flex gap-3 flex-wrap items-center justify-center my-4">
                                    <button onClick={() => navigate('/contact')} type="button" className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md font-medium h-12 px-8 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                        Book Consultation

                                        <Video strokeWidth={1.5} />
                                    </button>
                                </div>

                                <p className="text-gray-600 mt-2 max-w-5xl max-md:text-sm">
                                    Expert Advice • Ask Anything Freely • Fast Response Guaranteed
                                </p>
                            </div>
                        </section>
                    </div>
                </section>
            </Container>
        </section>
    );
}

export default SingleBlog;