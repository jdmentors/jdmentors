import { Verified } from "lucide-react";
import { aboutUs, daniel, michael, priya, sarah } from "../assets";
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
        <section className="pt-32 bg-blue-100">
            <Container className="grid lg:grid-cols-2 gap-5 mb-16">
                <div className="bg-white rounded-2xl p-8">
                    <h5 className="font-semibold text-blue-600">How It Started</h5>
                    <h2 className="text-4xl md:text-5xl font-bold my-5 text-blue-950">Empowering the Next Generation of Law Students</h2>

                    <p>It all began with a simple idea: law school applicants deserve better guidance—especially those aiming beyond the top 14. After seeing too many talented students struggle with their personal statements and addendums, we stepped in to help. What started as a few one-on-one consultations quickly grew into a trusted service for aspiring law students nationwide.
                    <br />
                    <br />
                    Fueled by real stories, real results, and a passion for student success, we've helped hundreds refine their narratives, gain confidence, and secure admission offers from law schools they once thought were out of reach.</p>
                    <br />

                    <ul>
                        <li className="flex items-center gap-1"><Verified size={18} className="text-blue-600" /> 1-on-1 Personalized Guidance</li>
                        <li className="flex items-center gap-1"><Verified size={18} className="text-blue-600" />Expert Review of Personal Statements</li>
                        <li className="flex items-center gap-1"><Verified size={18} className="text-blue-600" />Higher Acceptance Rates</li>
                        <li className="flex items-center gap-1"><Verified size={18} className="text-blue-600" />Support for Non-T14 Applicants</li>
                        <li className="flex items-center gap-1"><Verified size={18} className="text-blue-600" />Fast Response Times & Flexible Scheduling</li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    <div className="flex items-stretch">
                        <img src={aboutUs} loading="lazy" alt="About Us" className="h-60 sm:h-80 lg:h-105 md:h-96 xl:h-96 w-full object-cover rounded-2xl" />
                    </div>
                    <div className="bg-white grid grid-cols-2 gap-8 p-10 rounded-2xl">
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
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 md:p-12 lg:p-14 rounded-2xl mb-16">
                    <div>
                        <h5 className="font-semibold text-blue-600">Our Vision</h5>
                        <h2 className="text-2xl md:text-3xl font-semibold my-5 text-blue-950">Every Student Deserves a Fair Shot</h2>

                        <p className="text-gray-600">We believe that law school admissions shouldn't be limited by privilege, connections, or confusing processes. Every student deserves expert support and clear guidance. That’s why we’re committed to make the lawyer the world needs.</p>
                    </div>

                    <div>
                        <h5 className="font-semibold text-blue-600">Our Mission</h5>
                        <h2 className="text-2xl md:text-3xl font-semibold my-5 text-blue-950">Personalized Help. Proven Outcomes.</h2>

                        <p className="text-gray-600">From crafting standout personal statements to addressing academic gaps with clarity, we provide focused, strategic support that’s helped hundreds of students gain admission and scholarships at top law schools across the country.</p>
                    </div>
                </section>

                <section className="bg-white p-8 md:p-12 lg:p-14 rounded-2xl mb-16">
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
                </section>
            </Container>
            <CallToAction />
        </section>
    );
}

export default AboutUs;