import Marquee from "react-fast-marquee";
import { amelia, daniel, emily, ethan, james, kim, lina, michael, natalie, omar, priya, sarah } from "../assets";
import { CallToAction, Container, Stat, TweetCard } from "../components";

const testimonials = [
    {
        name: 'Sarah J.',
        review: 'My consultant helped me find the perfect narrative thread that tied my experiences together in a way that made admissions committees take notice. I got into my top choice with a scholarship!',
        school: 'Accepted to Boston College Law',
        image: sarah,
    },
    {
        name: 'Michael T.',
        review: 'I was really worried about explaining my low GPA. The addendum consultation helped me frame it as a growth experience rather than an excuse. I got into all three schools I applied to!',
        school: 'Accepted to UC Hastings',
        image: michael,
    },
    {
        name: 'Priya K.',
        review: "The 1-on-1 sessions were invaluable. My consultant didn't just edit my essay—they helped me discover what made my story unique. The final personal statement was something I was truly proud of.",
        school: 'Accepted to Fordham Law',
        image: priya,
    },
    {
        name: 'Ethan R.',
        review: 'Thanks to their guidance, I finally understood how to structure my personal statement. It no longer felt generic. The personalized feedback I received was insightful and actionable.',
        school: 'Accepted to University of Miami Law',
        image: ethan,
    },
    {
        name: 'Lina M.',
        review: 'I had no idea how to approach my diversity statement. My consultant helped me craft a narrative that felt authentic and meaningful. It was one of the strongest parts of my application.',
        school: 'Accepted to Loyola Law School',
        image: lina,
    },
    {
        name: 'Daniel S.',
        review: 'The feedback was brutally honest—in the best way. Every draft got better, and by the end, I had a statement that felt both personal and polished. I’m proud to submit it.',
        school: 'Accepted to Cardozo School of Law',
        image: daniel,
    },
    {
        name: 'Natalie C.',
        review: 'My consultant helped me reframe my gap year and make it a strength in my application. The insights were practical, and the support was incredibly motivating throughout the process.',
        school: 'Accepted to American University Law',
        image: natalie,
    },
    {
        name: 'James B.',
        review: 'I struggled with condensing my thoughts into a clear and compelling narrative. Their structured approach and hands-on support made the process way less stressful.',
        school: 'Accepted to St. John’s Law School',
        image: james,
    },
    {
        name: 'Emily D.',
        review: 'I thought my draft was strong, but they showed me how to elevate it even more and make it better. Their edits improved the flow, focus, and impact without losing my voice.',
        school: 'Accepted to Brooklyn Law School',
        image: emily,
    },
    {
        name: 'Amelia R.',
        review: 'The addendum strategy session helped me address a character and fitness issue without sounding defensive. The final result was clear, and honest.',
        school: 'Accepted to University of San Diego Law',
        image: amelia,
    },
    {
        name: 'Kim Min-Ha',
        review: 'They guided me through every sentence of my personal statement. It felt like a collaborative effort, and the finished product truly represented me. I recommed this platform to all.',
        school: 'Accepted to Pepperdine School of Law',
        image: kim,
    },
    {
        name: 'Omar H.',
        review: 'I wasn’t sure how to stand out with a traditional background, but the consultant helped me find the unique angle in my story. That perspective made all the difference.',
        school: 'Accepted to Seton Hall Law',
        image: omar,
    }
];

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

function Testimonials() {
    return (
        <section className="mt-32">
            <Container>
                <h2 className="text-3xl font-bold text-blue-950">Hear From Students Like You</h2>
                <p className="md:text-lg text-blue-950 my-3">Here is what our students say who achieved their law school dreams</p>

                <section className="my-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-center">
                            {
                                stats.map(stat => (
                                    <Stat key={stat.name} name={stat.name} data={stat.data} />
                                ))
                            }
                        </div>
                </section>

                <section className="grid grid-cols-1 gap-6 my-12">
                    <div>
                    <Marquee speed={40} gradient={true} gradientColor="#EFF6FF" gradientWidth={50} pauseOnHover={true} className="flex items-stretch py-1 overflow-y-hidden">
                        {
                            testimonials.slice(0, 6).map(testimonial => (
                                <TweetCard key={testimonial.name} card={testimonial} />
                            ))
                        }
                    </Marquee>
                </div>

                <div>
                    <Marquee speed={40} gradient={true} gradientColor="#EFF6FF" gradientWidth={50} direction="right" pauseOnHover={true} className="flex items-stretch py-1 overflow-y-hidden">
                        {
                            testimonials.slice(7, 12).map(testimonial => (
                                <TweetCard key={testimonial.name} card={testimonial} />
                            ))
                        }
                    </Marquee>
                </div>
                </section>
            </Container>
            <CallToAction />
        </section>
    );
}

export default Testimonials;