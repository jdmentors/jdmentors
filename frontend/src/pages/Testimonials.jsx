import { CallToAction, Container, Stat, TweetCard } from "../components";
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { useRef } from "react";

const testimonials = [
    {
        name: 'Sarah J.',
        review: 'My consultant helped me find the perfect narrative thread that tied my experiences together in a way that made admissions committees take notice. I got into my top choice with a scholarship!',
        school: 'Accepted to Boston College Law',
    },
    {
        name: 'Michael T.',
        review: 'I was really worried about explaining my low GPA. The addendum consultation helped me frame it as a growth experience rather than an excuse. I got into all three schools I applied to!',
        school: 'Accepted to UC Hastings',
    },
    {
        name: 'Priya K.',
        review: "The 1-on-1 sessions were invaluable. My consultant didn't just edit my essay—they helped me discover what made my story unique. The final personal statement was something I was truly proud of.",
        school: 'Accepted to Fordham Law',
    },
    {
        name: 'Ethan R.',
        review: 'Thanks to their guidance, I finally understood how to structure my personal statement. It no longer felt generic. The personalized feedback I received was insightful and actionable.',
        school: 'Accepted to University of Miami Law',
    },
    {
        name: 'Lina M.',
        review: 'I had no idea how to approach my diversity statement. My consultant helped me craft a narrative that felt authentic and meaningful. It was one of the strongest parts of my application.',
        school: 'Accepted to Loyola Law School',
    },
    {
        name: 'Daniel S.',
        review: 'The feedback was brutally honest—in the best way. Every draft got better, and by the end, I had a statement that felt both personal and polished. I’m proud to submit it.',
        school: 'Accepted to Cardozo School of Law',
    },
    {
        name: 'Natalie C.',
        review: 'My consultant helped me reframe my gap year and make it a strength in my application. The insights were practical, and the support was incredibly motivating throughout the process.',
        school: 'Accepted to American University Law',
    },
    {
        name: 'James B.',
        review: 'I struggled with condensing my thoughts into a clear and compelling narrative. Their structured approach and hands-on support made the process way less stressful.',
        school: 'Accepted to St. John’s Law School',
    },
    {
        name: 'Emily D.',
        review: 'I thought my draft was strong, but they showed me how to elevate it even more and make it better. Their edits improved the flow, focus, and impact without losing my voice.',
        school: 'Accepted to Brooklyn Law School',
    },
    {
        name: 'Amelia R.',
        review: 'The addendum strategy session helped me address a character and fitness issue without sounding defensive. The final result was clear, and honest.',
        school: 'Accepted to University of San Diego Law',
    },
    {
        name: 'Kim Min-Ha',
        review: 'They guided me through every sentence of my personal statement. It felt like a collaborative effort, and the finished product truly represented me. I recommed this platform to all.',
        school: 'Accepted to Pepperdine School of Law',
    },
    {
        name: 'Omar H.',
        review: 'I wasn’t sure how to stand out with a traditional background, but the consultant helped me find the unique angle in my story. That perspective made all the difference.',
        school: 'Accepted to Seton Hall Law',
    }
];

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
        name: 'Scholarships Obtained',
        data: '6 Figures+'
    },
    {
        name: 'Average Rating',
        data: `5.0`
    }
];

function Testimonials() {
    const timer1 = useRef();
    const timer2 = useRef();

    const [sliderRef1] = useKeenSlider({
        loop: true,
        mode: "snap",
        slides: { perView: 4, spacing: 15 },
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
            startAutoplay(s, timer1);
        },
        dragStarted() {
            stopAutoplay(timer1);
        },
        animationEnded(s) {
            startAutoplay(s, timer1);
        },
        updated(s) {
            startAutoplay(s, timer1);
        },
    });

    const [sliderRef2] = useKeenSlider({
        loop: true,
        mode: "snap",
        rtl: true,
        slides: { perView: 4, spacing: 15 },
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
            startAutoplay(s, timer2);
        },
        dragStarted() {
            stopAutoplay(timer2);
        },
        animationEnded(s) {
            startAutoplay(s, timer2);
        },
        updated(s) {
            startAutoplay(s, timer2);
        },
    });

    function startAutoplay(slider, timerRef) {
        stopAutoplay(timerRef);
        timerRef.current = setInterval(() => {
            if (slider) slider.next();
        }, 1500);
    }

    function stopAutoplay(timerRef) {
        clearInterval(timerRef.current);
    }

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

                <section className="grid grid-cols-1 gap-6 my-10">
                    <div ref={sliderRef1} className="keen-slider py-4">
                        {
                            testimonials.slice(0, 6).map(testimonial => (
                                <TweetCard key={testimonial.name} card={testimonial} />
                            ))
                        }
                    </div>

                    <div ref={sliderRef2} className="keen-slider py-4">
                        {
                            testimonials.slice(7, 12).map(testimonial => (
                                <TweetCard key={testimonial.name} card={testimonial} />
                            ))
                        }
                    </div>
                </section>
            </Container>
            <CallToAction />
        </section>
    );
}

export default Testimonials;