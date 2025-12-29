import { CallToAction, Container, Stat, TweetCard } from "../components";
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { useRef } from "react";
import useGoogleReviews from "../hooks/useGoogleReviews";

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

function Testimonials() {
    const timer1 = useRef();
    const timer2 = useRef();

    const placeId = 'ChIJ4RJDdwBhwokRiztE6o7hV_w';

    const { reviews, loading, error } = useGoogleReviews(placeId);

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
                <h2 className="text-3xl font-bold text-blue-950">Student's Experience</h2>
                <p className="md:text-lg text-blue-950 my-3">Here is what our students say who achieved their law school dreams</p>

                <section className="my-12">
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
                                Sarah J. - Accepted to Boston College Law
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
                                Michael T. - Accepted to UC Hastings
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-center">
                        {
                            stats.map(stat => (
                                <Stat key={stat.name} name={stat.name} data={stat.data} />
                            ))
                        }
                    </div>
                </section>

                {/* --- NEW: Google Reviews Section --- */}
                <section className="my-12">
                    <h3 className="text-2xl font-bold text-blue-950 mb-8 text-center">What Students Say on Google</h3>

                    {loading && <p className="text-center text-gray-600">Loading genuine reviews...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}

                    {!loading && !error && reviews.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {reviews.map((review, index) => (
                                <div key={index} className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                                    {/* Review Rating */}
                                    <div className="flex items-center mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <span className="ml-2 font-semibold text-gray-800">{review.rating}.0</span>
                                    </div>
                                    {/* Review Text */}
                                    <p className="text-gray-700 text-sm mb-4 line-clamp-4">"{review.text}"</p>
                                    {/* Reviewer Info */}
                                    <div className="flex items-center border-t pt-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                            <span className="font-bold text-blue-600 text-sm">
                                                {review.author_name ? review.author_name.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-blue-950 text-sm">
                                                {review.author_name || 'Google User'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {review.relative_time_description || 'Google Review'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                {/* --- End of Google Reviews Section --- */}

                {/* <section className="grid grid-cols-1 gap-6 my-10">
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
                </section> */}
            </Container>
            <CallToAction />
        </section>
    );
}

export default Testimonials;