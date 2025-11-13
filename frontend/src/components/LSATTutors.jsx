import { CalendarCheck, Star, Award, Clock, Users, BookOpen, Target, Verified, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "./";
import { user } from "../assets";
import { useState, useEffect } from "react";
import useGetAllTutors from "../hooks/useGetAllTutor";
import { Link } from "react-router";

function LSATTutors() {
    const [tutors, setTutors] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const getAllTutors = useGetAllTutors();

    useEffect(() => {
        const fetchAllTutors = async () => {
            setTutors(await getAllTutors());
        }
        fetchAllTutors();
    }, [])

    // Calculate tutors to show (4 per page)
    const tutorsPerPage = 4;
    const totalPages = Math.ceil(tutors.length / tutorsPerPage);
    const startIndex = currentPage * tutorsPerPage;
    const currentTutors = tutors.slice(startIndex, startIndex + tutorsPerPage);

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <section className="py-16 bg-blue-100">
            <Container>
                <div className="grid lg:grid-cols-2 gap-10 items-start">
                    {/* Left Side - Tutors Grid with Fixed Height */}
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
                                Perfect Tutors Are Found Here
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Meet our team of expert LSAT tutors from top law schools
                            </p>
                        </div>

                        {/* Tutors Container with Fixed Height */}
                        <div className="relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-h-[250px]">
                                {currentTutors.map((tutor) => (
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

                            {/* Navigation Buttons - Only show if more than 4 tutors */}
                            {tutors.length > tutorsPerPage && (
                                <div className="flex justify-center items-center gap-4 mt-6">
                                    <button
                                        onClick={prevPage}
                                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
                                        aria-label="Previous tutors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    
                                    <span className="text-sm text-gray-600">
                                        {currentPage + 1} / {totalPages}
                                    </span>
                                    
                                    <button
                                        onClick={nextPage}
                                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
                                        aria-label="Next tutors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Description & Buttons (unchanged) */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-blue-950 mb-4">
                                    Personalized LSAT Tutoring
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    At JD Mentors, we've assembled an elite team of instructors who haven't just aced the LSAT—they've mastered how to teach it. Every mentor has scored in the 99th percentile, with many achieving a perfect 180.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    But what truly sets us apart is our commitment to a personalized partnership. We retain a close-knit, "mentor-first" culture. We don't just assign a tutor; we ensure you get the chance to choose the ideal mentor based on your goals and learning style.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Target className="text-green-600" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">99th Percentile Scorers</h4>
                                        <p className="text-gray-600 text-sm">All tutors are top performers</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <BookOpen className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Personalized Matching</h4>
                                        <p className="text-gray-600 text-sm">Find your ideal mentor</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Clock className="text-purple-600" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Proven Strategies</h4>
                                        <p className="text-gray-600 text-sm">Tested tips and techniques</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4 pt-4">
                                <Link 
                                    to="/checkout/lsat-session?type=free"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                                >
                                    <Users size={20} />
                                    <span>Start with Free Consultation</span>
                                </Link>
                                
                                <Link 
                                    to="/checkout/lsat-session?type=one-on-one"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                                >
                                    <BookOpen size={20} />
                                    <span>Book 1-on-1 Tutoring</span>
                                </Link>
                            </div>

                            <div className="text-center pt-4">
                                <p className="text-gray-500 text-sm">
                                    All tutors are verified and have scored in the 95th percentile or higher
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default LSATTutors;