import { daniel, emily, michael, omar, priya, sarah } from "../assets";
import { CallToAction, Container, Hero, FAQ, Stat, AboutUs, LoadingSpinner } from "../components";
import Marquee from "react-fast-marquee";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { lazy } from "react";
import { Suspense } from "react";

const AllServices = lazy(() => import('../components/AllServices'));
const Testimonial = lazy(() => import('../components/Testimonial'));
const AllBlogs = lazy(() => import('../components/AllBlogs'));

const faqs = [
    {
        question: "How many revisions do you provide for personal statements?",
        answer: "Our standard personal statement review includes two rounds of revisions, but we offer additional rounds if needed. During our 1-on-1 sessions, we'll work iteratively to refine your statement until you're completely satisfied with the final product."
    },
    {
        question: "Do you help with scholarship negotiation too?",
        answer: "Yes! Many students have received scholarships they aren't the most excited about, but we always encourage students to negotiate. Any extra money you gain is less money you have to pay back down the line. Send us a message so we can help you get started!"
    },
    {
        question: "How early should I start working on my application?",
        answer: "We recommend starting at least 3-4 months before application deadlines. This gives us time for multiple drafts and ensures your materials are polished. However, we can work with tighter timelines if needed—contact us to discuss expedited options."
    },
    {
        question: "What makes your approach different for non-T14 schools?",
        answer: "Non-T14 schools often evaluate candidates differently than elite programs. We focus on demonstrating your potential for success in their specific programs, highlighting regional connections, practical experience, and how you align with each school's unique strengths and mission."
    }
];

const testimonials = [
    {
        name: 'Sarah J.',
        review: 'The personal statement review was transformative. My consultant helped me find the perfect narrative thread that tied my experiences together in a way that made admissions committees take notice. I got into my top choice with a scholarship!',
        school: 'Accepted to Boston College Law',
        image: sarah
    },
    {
        name: 'Michael T.',
        review: 'I was really worried about explaining my low GPA from freshman year. The addendum consultation helped me frame it as a growth experience rather than an excuse. The final product was concise and effective—I got into all three schools I applied to!',
        school: 'Accepted to UC Hastings',
        image: michael
    },
    {
        name: 'Priya K.',
        review: "The 1-on-1 sessions were invaluable. My consultant didn't just edit my essay—they helped me discover what made my story unique. The final personal statement was something I was truly proud of, and it clearly resonated with admissions committees.",
        school: 'Accepted to Fordham Law',
        image: priya
    },
    {
        name: 'Daniel R.',
        review: "As a non-traditional applicant, I felt unsure about how to position my work experience. My consultant helped me connect it directly to the skills law schools look for. The result was a powerful narrative I couldn’t have written alone.",
        school: 'Accepted to Loyola Law School',
        image: daniel
    },
    {
        name: 'Emily C.',
        review: "I had no idea how important the personal statement was until I went through this process. The feedback was sharp, honest, and encouraging. I ended up with an essay that reflected my voice perfectly—and I got into multiple schools.",
        school: 'Accepted to Brooklyn Law School',
        image: emily
    },
    {
        name: 'Omar S.',
        review: "What stood out was how personalized the help was. My consultant asked the right questions and pushed me to go deeper with my story. It felt like they genuinely cared about my success. I’m incredibly grateful and would suggest the platform to all.",
        school: 'Accepted to UMiami Law',
        image: omar
    }
];

const stats = [
    {
        name: 'Students Helped',
        data: '500+'
    },
    {
        name: 'Acceptance Rate',
        data: '100%'
    },
    {
        name: 'Schools Repesented',
        data: '100+'
    },
    {
        name: 'Average Rating',
        data: `4.9`
    }
];

function Home() {
    return (
        <div className="min-h-[70vh]">
            <Hero />

            {/* Stats section */}
            <section className="mt-12">
                <Container>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-center">
                        {
                            stats.map(stat => (
                                <Stat key={stat.name} name={stat.name} data={stat.data} />
                            ))
                        }
                    </div>
                </Container>
            </section>

            {/* Services section */}
            <section className="mt-12">
                <Container>
                    <div>

                        <h2 className="text-3xl font-bold text-blue-950">Our Specialized Services</h2>
                        <p className="md:text-lg text-blue-950 mt-3 mb-10">Tailored support to make your law school application stand out.</p>

                        <Suspense fallback={<LoadingSpinner />}>
                            <AllServices limit={3} />
                        </Suspense>

                        <div className="flex justify-center mt-10">
                            <Link className="py-2.5 px-6 rounded-md bg-blue-600 text-white inline-flex items-center gap-2" to="/services">All Services <ArrowRight /></Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* About us */}
            <AboutUs />

            {/* Testimonials section */}
            <section className="mt-12 md:mt-16">
                <Container>
                    <div>

                        <h2 className="text-3xl font-bold text-blue-950">Success Stories</h2>
                        <p className="md:text-lg text-blue-950 my-3">Hear from students who achieved their law school dreams</p>

                        <Suspense fallback={<LoadingSpinner />}>
                            <div>
                                <Marquee speed={40} pauseOnHover={true} gradient={true} gradientColor="#EFF6FF" gradientWidth={50} className="flex items-stretch py-1 overflow-y-hidden">
                                    {
                                        testimonials.map(testimonial => (
                                            <Testimonial key={testimonial.name} name={testimonial.name} school={testimonial.school} review={testimonial.review} image={testimonial.image} />
                                        ))
                                    }
                                </Marquee>
                            </div>
                        </Suspense>
                    </div>
                </Container>
            </section>

            {/* Blogs section */}
            <section className="mt-12">
                <Container>
                    <div>
                        <h2 className="text-3xl font-bold text-blue-950">Insights for Law School Success</h2>
                        <p className="text-blue-950 mt-4 mb-8">Whether you're perfecting your personal statement or navigating addendums, our blog delivers the guidance you need—one post at a time.</p>

                        <Suspense fallback={<LoadingSpinner />}>
                            <AllBlogs limit={3} />
                        </Suspense>

                        <div className="flex justify-center mt-10">
                            <Link className="py-2.5 px-6 rounded-md bg-blue-600 text-white inline-flex items-center gap-2" to="/blogs">More Posts <ArrowRight /></Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* FAQs section */}
            <section className="my-12">
                <Container>
                    <div>
                        <h2 className="text-3xl font-bold text-blue-950">Frequently Asked Questions</h2>
                        <p className="text-blue-950 my-4">Answers to common questions about our consultation services</p>

                        <div className="bg-white shadow-md shadow-blue-100 overflow-hidden border border-blue-100 rounded-lg">
                            {
                                faqs.map(faq => (
                                    <FAQ key={faq.question} question={faq.question} answer={faq.answer} />
                                ))
                            }
                        </div>
                    </div>
                </Container>
            </section>

            <CallToAction />
        </div>
    );
}

export default Home;