import { CallToAction, Container, Hero, FAQ, Stat, AboutUs, LoadingSpinner, AllPackages, AllAddons, AllExtras } from "../components";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { lazy, useRef } from "react";
import { Suspense } from "react";
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

const AllServices = lazy(() => import('../components/AllServices'));
const Testimonial = lazy(() => import('../components/Testimonial'));
const AllBlogs = lazy(() => import('../components/AllBlogs'));

const faqs = [
    {
        question: "How early should I start working on my application?",
        answer: "We suggest starting about 3-4 months before your application deadlines. That gives us plenty of time to work through multiple drafts and make sure everything is polished. If you’re on a tighter schedule, we can still help. Just reach out to us regarding rush options and developing application strategies."
    },
    // {
    //     question: "What makes applying to non-T14 schools different?",
    //     answer: "Non-T14 schools evaluate applicants differently than the most elite programs. They tend to place greater weight on your potential to succeed in their environment. This includes things like your practical experience, the clarity of your career goals, and how well you align with the school’s mission, values, and strengths. Our role is to help you present a compelling case that speaks directly to what each program cares about most and increase your value to them."
    // },
    {
        question: "Can I get more scholarship money from a school that already sent me an offer?",
        answer: "Yes! A lot of applicants don’t realize that scholarship offers aren’t always set in stone. Even after you’ve been admitted, schools will sometimes reconsider and bump up their initial offer. We’ll help you navigate that process so you have the best chance of getting more rewards."
    },
    {
        question: "Should I create an account or just continue as a guest?",
        answer: "We recommend creating an account so you can save your work, track revisions, and receive updates from us. It’ll also help us keep your progress in mind and better support you throughout the application process. However, if you’d rather not, you can still continue as a guest."
    }
];

const testimonials = [
    {
        name: 'Sarah J.',
        review: 'The personal statement review was transformative. My consultant helped me find the perfect narrative thread that tied my experiences together in a way that made admissions committees take notice. I got into my top choice with a scholarship!',
        school: 'Accepted to Boston College Law',
    },
    {
        name: 'Michael T.',
        review: 'I was really worried about explaining my low GPA from freshman year. The addendum consultation helped me frame it as a growth experience rather than an excuse. The final product was concise and effective—I got into all three schools I applied to!',
        school: 'Accepted to UC Hastings',
    },
    {
        name: 'Priya K.',
        review: "The 1-on-1 sessions were invaluable. My consultant didn't just edit my essay—they helped me discover what made my story unique. The final personal statement was something I was truly proud of, and it clearly resonated with admissions committees.",
        school: 'Accepted to Fordham Law',
    },
    {
        name: 'Daniel R.',
        review: "As a non-traditional applicant, I felt unsure about how to position my work experience. My consultant helped me connect it directly to the skills law schools look for. The result was a powerful narrative I couldn’t have written alone.",
        school: 'Accepted to Loyola Law School',
    },
    {
        name: 'Emily C.',
        review: "I had no idea how important the personal statement was until I went through this process. The feedback was sharp, honest, and encouraging. I ended up with an essay that reflected my voice perfectly—and I got into multiple schools.",
        school: 'Accepted to Brooklyn Law School',
    },
    {
        name: 'Omar S.',
        review: "What stood out was how personalized the help was. My consultant asked the right questions and pushed me to go deeper with my story. It felt like they genuinely cared about my success. I’m incredibly grateful and would suggest the platform to all.",
        school: 'Accepted to UMiami Law',
    }
];

const stats = [
    {
        name: 'Applicants Helped',
        data: '100+'
    },
    {
        name: 'Acceptance Rate',
        data: '100%'
    },
    {
        name: 'Exceeded Aid Expectations',
        data: '99%'
    },
    {
        name: 'Average Rating',
        data: `5/5`
    }
];

function Home() {
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

    return (
        <div className="min-h-[70vh]">
            <Hero />

            <Container>
                <section className="my-12">
                    <h2 className="text-3xl font-bold text-blue-950">Student Experiences</h2>
                    <p className="md:text-lg text-blue-950 mt-3 mb-5">Listen to students reflect on their experience preparing law school applications with JD Mentors.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="aspect-video mb-2">
                                <iframe
                                    className="w-full h-full rounded-2xl"
                                    src="https://www.youtube.com/embed/WMWEu6JKjUE?si=CXCH1g0LTRpu3aNd"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <p className="text-center font-medium text-blue-950">
                                Camila - Fall 2026 Applicant
                            </p>
                        </div>

                        <div>
                            <div className="aspect-video mb-2">
                                <iframe
                                    className="w-full h-full rounded-2xl"
                                    src="https://www.youtube.com/embed/e1rpMD3vz-E?si=zVsh2VAbcASDdiRq"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <p className="text-center font-medium text-blue-950">
                                Reed - Fall 2026 Applicant
                            </p>
                        </div>
                    </div>
                </section>
            </Container>

            {/* Stats section */}
            <section className="mt-12">
                <Container>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-center">
                        {
                            stats.map(stat => (
                                <Stat key={stat.name} name={stat.name} data={stat.data} />
                            ))
                        }
                    </div>
                </Container>
            </section>

            {/* About us */}
            <AboutUs />

            {/* Packages section */}
            <section className="mt-14">
                <Container>
                    <div>

                        <h2 className="text-3xl font-bold text-blue-950">All-In-One Solutions</h2>
                        <p className="md:text-lg text-blue-950 mt-3 mb-10">Full-service guidance designed to maximize admissions and scholarship results.</p>

                        <Suspense fallback={<LoadingSpinner />}>
                            <AllPackages limit={3} />
                        </Suspense>

                        <div className="flex justify-center mt-10">
                            <Link className="py-2.5 px-6 rounded-md bg-blue-600 text-white inline-flex items-center gap-2" to="/services">All Services <ArrowRight /></Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Testimonials section */}
            {/* <section className="mt-12 md:mt-16">
                <Container>
                    <div>

                        <h2 className="text-3xl font-bold text-blue-950">Success Stories</h2>
                        <p className="md:text-lg text-blue-950 my-3">Hear from students who achieved their law school dreams</p>

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
            </section> */}

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
