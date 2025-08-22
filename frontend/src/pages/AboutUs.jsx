import { DollarSign, Verified } from "lucide-react";
import { aboutUs, banner } from "../assets";
import { CallToAction, Container } from "../components";

const stats = [
    {
        name: 'Students Helped',
        data: '50+'
    },
    {
        name: 'Acceptance Rate',
        data: '100%'
    },
    {
        name: 'Exceeded Aid Expectations',
        data: '99%'
    },
    // {
    //     name:'Schools Repesented',
    //     data:'100+'
    // },
    {
        name: 'Average Rating',
        data: `5/5`
    }
];

function AboutUs() {
    return (
        <section className="pt-32 bg-blue-100 max-w-full">
            <Container className="grid lg:grid-cols-2 gap-5 mb-16 max-w-full items-start">
                <div className="bg-white rounded-2xl px-5 py-8 sm:p-8">
                    <h5 className="font-semibold text-blue-600">How It Started</h5>
                    <h2 className="text-2xl md:text-4xl xl:text-5xl font-bold my-3 text-blue-950">Empowering the Next Generation of Law Students</h2>

                    <p>We started with a simple observation: too many capable law school applicants were getting overlooked. Not because they lacked potential, but because they lacked the right guidance. Students were pouring their energy into personal statements and addendums, yet their applications still didn't capture who they truly were. That's when we stepped in.
                        <br />
                        <br />
                        What began as a few one-on-one conversations soon grew into something larger. As word spread, more students reached out, and today we work with applicants all across New York. Each comes with a different story, but they all share the same goal: getting into law school to become a successful future lawyer.
                        <br />
                        <br />
                        Since then, we've helped countless students refine their narratives, strengthen their applications, and gain the confidence they need to move forward. Our focus goes beyond the application itself- we're here to help students gain admission to the schools they want and maximize their scholarship opportunities.
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

                <div className="flex flex-col h-full">
                    <div className="relative aspect-[4/3] lg:aspect-auto lg:flex-grow">
                        <img src={aboutUs} loading="lazy" alt="About Us" className="absolute h-full w-full object-cover rounded-2xl" />
                    </div>
                    <div className="bg-white grid grid-cols-2 gap-5 p-5 sm:p-10 rounded-2xl mt-5">
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

                <section className="bg-white p-8 md:p-12 lg:p-14 rounded-2xl mb-16">
                    <h5 className="font-semibold text-blue-600">Meet Our Team</h5>
                    <h2 className="text-2xl md:text-3xl font-semibold my-5 text-blue-950">Meet Our Team of Consultants</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        <div className="h-80 rounded-2xl overflow-hidden relative">
                            <img src={banner} loading="lazy" alt="consultant" className="w-full h-full object-cover" />
                            <div className="absolute py-2 rounded-xl bg-white bottom-5 w-10/12 text-center right-1/2 translate-x-1/2 text-sm">
                                <p className="text-base font-semibold">Alan Parker</p>
                                <p className="text-gray-600">Consultant</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white p-8 md:p-12 lg:p-14 rounded-2xl mb-16">
                    <h5 className="font-semibold text-blue-600">Goal In Action</h5>
                    <h2 className="text-2xl md:text-3xl font-semibold mt-5 mb-7 text-blue-950">See How Much We’ve Saved For Our Students</h2>

                    <div className="flex flex-col items-start sm:flex-row sm:items-center gap-5">
                        <div className="bg-blue-600 p-3 rounded-md">
                            <DollarSign className="text-white" size={40} />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <p className="text-gray-600">This Year We Want To Save Our Students <span className="font-semibold">$15 Million</span></p>

                            <div className="relative flex items-center max-w-80 min-w-full bg-gray-500/20 h-5 rounded-full">
                                <div className="bg-blue-600 h-5 rounded-full" style={{ width: '66%' }}></div>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                                    66%
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </Container >
            <CallToAction />
        </section >
    );
}

export default AboutUs;
