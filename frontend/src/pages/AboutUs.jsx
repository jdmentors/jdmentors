import { Verified } from "lucide-react";
import { aboutUs } from "../assets";
import { CallToAction, Container } from "../components";

const stats = [
    {
        name:'Students Helped',
        data:'500+'
    },
    {
        name:'Acceptance Rate',
        data:'100%'
    },
    {
        name:'Schools Repesented',
        data:'100+'
    },
    {
        name:'Average Rating',
        data:`4.9`
    }
];

function AboutUs() {
    return (
        <section className="pt-32 bg-blue-100 max-w-full">
            <Container className="grid lg:grid-cols-2 gap-5 mb-16 max-w-full">
                <div className="bg-white rounded-2xl px-5 py-8 sm:p-8">
                    <h5 className="font-semibold text-blue-600">How It Started</h5>
                    <h2 className="text-2xl md:text-4xl xl:text-5xl font-bold my-3 text-blue-950">Empowering the Next Generation of Law Students</h2>

                    <p>It all started with a simple observation: too many smart, capable law school applicants were getting overlooked; not because they lacked potential, but because they didn’t have the right guidance. We saw students pouring their hearts into personal statements and addendums, only to find themselves frustrated when their applications didn’t reflect who they really were. That’s when we decided to step in.
                    <br />
                    <br />
                    What began as a handful of one-on-one conversations with students slowly grew into something bigger. As word spread, more students reached out, and now we support applicants all throughout New York. They come from different backgrounds and experiences, but they all share the same goal: finding their way into law school.
                    <br />
                    <br />
                    Since then, we’ve had the privilege of helping many future law students refine their narratives, strengthen their applications, and, most importantly, build confidence in themselves. We couldn’t be happier with the results.
                    <br />
                    <br />
                    At the heart of it, this has always been about more than admissions. It’s about showing students that their voice matters, that their story has power, and that with the right guidance, they can take the next step toward a legal career they’ve been dreaming of.
                    </p>
                    <br />

                    <ul>
                        <li className="flex items-center gap-1"><Verified size={18} className="text-blue-600" /> 1-on-1 Personalized Guidance</li>
                        <li className="flex items-center gap-1"><Verified size={18} className="text-blue-600" />Expert Review of Personal Statements</li>
                        <li className="flex items-center gap-1"><Verified size={18} className="text-blue-600" />Higher Acceptance Rates</li>
                        <li className="flex items-center gap-1"><Verified size={18} className="text-blue-600" />Support for Non-T14 Applicants</li>
                        <li className="flex items-center gap-1"><Verified size={18} className="text-blue-600" />Fast Response Times & Flexible Scheduling</li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 items-stretch">
                    <div className="flex items-stretch">
                        <img src={aboutUs} loading="lazy" alt="About Us" className="h-72 lg:h-full md:h-72 xl:max-h-150 w-full object-cover rounded-2xl" />
                    </div>
                    <div className="bg-white grid grid-cols-2 gap-8 p-5 sm:p-10 rounded-2xl">
                        {
                            stats.map(stat => (
                                <div key={stat.name}>
                                    <p className="text-3xl font-bold text-blue-950">{stat.data}</p>
                                    <p className="text-gray-600">{stat.name}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Container>

            <Container>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white px-5 py-8 sm:p-8 md:p-12 lg:p-14 rounded-2xl mb-16">
                    <div>
                        <h5 className="font-semibold text-blue-600">Our Vision</h5>
                        <h2 className="text-2xl md:text-3xl font-semibold my-3 text-blue-950">Every Student Deserves a Fair Shot</h2>

                        <p className="text-gray-600">We believe that law school admissions shouldn't be limited by privilege, connections, or confusing processes. Every student deserves expert support and clear guidance. That’s why we’re committed to make the lawyer the world needs.</p>
                    </div>

                    <div>
                        <h5 className="font-semibold text-blue-600">Our Mission</h5>
                        <h2 className="text-2xl md:text-3xl font-semibold my-3 text-blue-950">Personalized Help. Proven Outcomes.</h2>

                        <p className="text-gray-600">From crafting standout personal statements to addressing academic gaps with clarity, we provide focused, strategic support that’s helped hundreds of students gain admission and scholarships at top law schools across the country.</p>
                    </div>
                </section>

                {/* <section className="bg-white p-8 md:p-12 lg:p-14 rounded-2xl mb-16">
                    <h5 className="font-semibold text-blue-600">Meet Our Team</h5>
                    <h2 className="text-2xl md:text-3xl font-semibold my-5 text-blue-950">Meet Our Dedicated Team of Consultants</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        <div className="h-80 rounded-2xl overflow-hidden relative">
                            <img src={daniel} loading="lazy" alt="consultant" className="w-full h-full object-cover" />
                            <div className="absolute py-2 rounded-xl bg-white bottom-5 w-10/12 text-center right-1/2 translate-x-1/2 text-sm">
                                <p className="text-base font-semibold">Alan Parker</p>
                                <p className="text-gray-600">Consultant</p>
                            </div>
                        </div>

                        <div className="h-80 rounded-2xl overflow-hidden relative">
                            <img src={michael} loading="lazy" alt="consultant" className="w-full h-full object-cover" />
                            <div className="absolute py-2 rounded-xl bg-white bottom-5 w-10/12 text-center right-1/2 translate-x-1/2 text-sm">
                                <p className="text-base font-semibold">Daniel Spears</p>
                                <p className="text-gray-600">Consultant</p>
                            </div>
                        </div>

                        <div className="h-80 rounded-2xl overflow-hidden relative">
                            <img src={sarah} loading="lazy" alt="consultant" className="w-full h-full object-cover" />
                            <div className="absolute py-2 rounded-xl bg-white bottom-5 w-10/12 text-center right-1/2 translate-x-1/2 text-sm">
                                <p className="text-base font-semibold">Jean Mcalin</p>
                                <p className="text-gray-600">Consultant</p>
                            </div>
                        </div>

                        <div className="h-80 rounded-2xl overflow-hidden relative">
                            <img src={priya} loading="lazy" alt="consultant" className="w-full h-full object-cover" />
                            <div className="absolute py-2 rounded-xl bg-white bottom-5 w-10/12 text-center right-1/2 translate-x-1/2 text-sm">
                                <p className="text-base font-semibold">Brenda Sydney</p>
                                <p className="text-gray-600">Consultant</p>
                            </div>
                        </div>
                    </div>
                </section> */}
            </Container>
            <CallToAction />
        </section>
    );
}

export default AboutUs;