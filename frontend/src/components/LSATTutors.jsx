import { CalendarCheck, Verified } from "lucide-react";
import { Container } from "./";
import { user } from "../assets";
import { useState, useEffect } from "react";
import useGetAllTutors from "../hooks/useGetAllTutor";
import { Link } from "react-router";

function LSATTutors() {
    const [tutors, setTutors] = useState([]);
    const getAllTutors = useGetAllTutors();

    useEffect(() => {
        const fetchAllTutors = async () => {
            setTutors(await getAllTutors());
        }
        fetchAllTutors();
    }, [])

    return (
        <section className="my-14 py-10 bg-blue-100 max-w-full text-gray-600">
            <Container>
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-blue-950 mb-4">Perfect Score Tutors Are Found Here</h3>

                    <div className="bg-white rounded-2xl p-8 md:p-12 lg:p-14 mb-8">
                        <p className="text-lg text-blue-950 mb-6">
                            At JD Mentors, we've assembled an elite team of instructors who haven't just aced the LSAT—they've mastered how to teach it. Every mentor has scored in the 99th percentile, with many achieving a perfect 180.
                        </p>

                        <p className="text-lg text-blue-950">
                            But what truly sets us apart is our commitment to a personalized partnership. We retain a close-knit, "mentor-first" culture. We don't just assign a tutor; we ensure you get the chance to choose the ideal mentor based on your goals and learning style.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to={`/checkout/lsat-session?type=one-on-one`} className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 md:self-start self-center cursor-pointer">
                            <CalendarCheck size={24} strokeWidth={1.5} />

                            <span>Book 1-on-1 Session</span>
                        </Link>

                        <Link to={`/checkout/lsat-session?type=class`} className="inline-flex items-center justify-center gap-1 text-blue-600 hover:text-white transition-all duration-200 border border-blue-600 whitespace-nowrap rounded-md font-medium h-10 px-4 py-2 bg-white hover:bg-blue-700 md:self-start self-center cursor-pointer">
                            <CalendarCheck size={24} strokeWidth={1.5} />

                            <span>Book Class Session</span>
                        </Link>

                        <Link to={`/checkout/lsat-session?type=free`} className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 md:self-start self-center cursor-pointer">
                            <CalendarCheck size={24} strokeWidth={1.5} />

                            <span>Book Free Consultation</span>
                        </Link>
                    </div>
                </div>

                {/* Tutors Grid Section */}
                <section className="bg-white p-8 md:p-12 lg:p-14 rounded-2xl">
                    <h5 className="font-semibold text-blue-600">Expert Instructors</h5>
                    <h2 className="text-2xl md:text-3xl font-semibold my-5 text-blue-950">Meet Your LSAT Mentors</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tutors && tutors.map((tutor) => (
                            <div key={tutor._id} className="bg-blue-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="mb-4">
                                    <img
                                        src={tutor.image || user}
                                        alt={tutor.fullName}
                                        className="h-16 w-16 object-cover rounded-full mx-auto mb-4"
                                    />
                                    <p className="text-xl font-bold text-blue-950">{tutor.fullName}</p>
                                    <p className="text-blue-600 font-semibold">{tutor.school}</p>
                                    <p className="text-gray-600 mt-1">{tutor.grades}</p>
                                    {tutor.description && (
                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{tutor.description}</p>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-1 justify-center">
                                    {tutor?.classes && tutor?.classes.slice(0, 3).map((cls, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                        >
                                            {cls}
                                        </span>
                                    ))}
                                    {tutor.classes && tutor.classes.length > 3 && (
                                        <span className="text-xs text-gray-500">
                                            +{tutor.classes.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <h4 className="text-lg font-semibold text-blue-950 mt-8 mb-4">Why Choose Our LSAT Team</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <Verified size={18} className="text-blue-600" />
                                <span>99th Percentile Scorers</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Verified size={18} className="text-blue-600" />
                                <span>Comprehensive LSAT Training</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Verified size={18} className="text-blue-600" />
                                <span>Proven Tips & Strategies</span>
                            </li>
                        </ul>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <Verified size={18} className="text-blue-600" />
                                <span>Personalized Matching Process</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Verified size={18} className="text-blue-600" />
                                <span>Mom-and-Pop Company Care</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Verified size={18} className="text-blue-600" />
                                <span>Fully Invested in Student Success</span>
                            </li>
                        </ul>
                    </div>
                </section>
            </Container>
        </section>
    );
}

export default LSATTutors;