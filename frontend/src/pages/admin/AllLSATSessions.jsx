import { useEffect } from "react";
import { AdminContainer, AdminSidebar, LoadingSpinner, UserPopUp } from "../../components/index.js";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Check, Edit, FileDownIcon, HelpCircle, User, Calendar, Target, BookOpen, Clock, Users, Mail, Phone } from "lucide-react";
import { Link } from "react-router";
import useRefreshToken from "../../hooks/useRefreshToken.jsx";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import cleanFileName from "../../hooks/CleanFileName.jsx";
import { useForm } from "react-hook-form";

function AllLSATSessions() {
    const user = useSelector(state => state.user.user);
    const [allSessions, setAllSessions] = useState(null);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();
    const [selectedSession, setSelectedSession] = useState(null);
    const [showSessionDetails, setShowSessionDetails] = useState(false);

    useEffect(() => {
        const getAllSessions = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-sessions/all`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

                if (data.success) {
                    setAllSessions(data.data);
                }
            } catch (error) {
                const message = error?.response?.data?.message;
                if (message === 'accessToken') {
                    try {
                        const newAccessToken = await refreshAccessToken();

                        const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-sessions/all`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                        if (data && data.success) {
                            dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                            setAllSessions(data.data);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
        getAllSessions();
    }, [])

    const handleMarkAsCompleted = async (id) => {
        try {
            const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-sessions/complete/${id}`, {}, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                setAllSessions(sessions => {
                    return sessions.map(session => {
                        if (session._id === id) {
                            return { ...session, sessionCompleted: data.data.sessionCompleted }
                        }
                        return session;
                    })
                })
                toast.success(data.message);
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-sessions/complete/${id}`, {}, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        setAllSessions(sessions => {
                            return sessions.map(session => {
                                if (session._id === id) {
                                    return { ...session, sessionCompleted: data.data.sessionCompleted }
                                }
                                return session;
                            })
                        });
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    const handleViewDetails = (session) => {
        setSelectedSession(session);
        setShowSessionDetails(true);
    }

    const getSessionTypeDisplay = (type) => {
        switch (type) {
            case 'free': return 'Free Consultation';
            case 'one-on-one': return '1-on-1 Tutoring';
            case 'class': return 'Group Class';
            default: return type;
        }
    };

    const getSessionDuration = (type) => {
        switch (type) {
            case 'free': return '30 minutes';
            case 'one-on-one': return '60 minutes';
            case 'class': return '60 minutes';
            default: return '';
        }
    };

    return (
        <section className="flex min-h-[90vh]">
            {/* Session Details Modal */}
            {
                showSessionDetails && selectedSession &&
                <section className="top-0 left-0 right-0 bottom-0 bg-black/70 z-50 flex items-center justify-center fixed p-4">
                    <div className="flex flex-col bg-white shadow-md rounded-xl py-6 px-5 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <User className="text-blue-600" size={24} />
                                </div>
                                <h2 className="text-gray-900 font-semibold text-xl">Session Details</h2>
                            </div>
                            <button
                                onClick={() => setShowSessionDetails(false)}
                                className="text-gray-500 hover:text-gray-700 text-lg font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Student Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-blue-900 border-b pb-2">Student Information</h3>

                                <div className="flex items-center gap-3">
                                    <User size={18} className="text-blue-600" />
                                    <div>
                                        <p className="font-medium">Full Name</p>
                                        <p className="text-gray-600">{selectedSession.fullName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail size={18} className="text-blue-600" />
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-gray-600">
                                            <Link to={`mailto:${selectedSession.email}`} className="text-blue-600 hover:underline">
                                                {selectedSession.email}
                                            </Link>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone size={18} className="text-blue-600" />
                                    <div>
                                        <p className="font-medium">Phone</p>
                                        <p className="text-gray-600">{selectedSession.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className="text-blue-600" />
                                    <div>
                                        <p className="font-medium">Scheduled Date & Time</p>
                                        <p className="text-gray-600">{new Date(selectedSession.dateTime).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Session Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-blue-900 border-b pb-2">Session Information</h3>

                                <div className="flex items-center gap-3">
                                    <BookOpen size={18} className="text-blue-600" />
                                    <div>
                                        <p className="font-medium">Session Type</p>
                                        <p className="text-gray-600">{getSessionTypeDisplay(selectedSession.sessionType)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock size={18} className="text-blue-600" />
                                    <div>
                                        <p className="font-medium">Duration</p>
                                        <p className="text-gray-600">{getSessionDuration(selectedSession.sessionType)}</p>
                                    </div>
                                </div>

                                {selectedSession.sessionType === 'class' && (
                                    <div className="flex items-center gap-3">
                                        <Users size={18} className="text-blue-600" />
                                        <div>
                                            <p className="font-medium">Number of Students</p>
                                            <p className="text-gray-600">{selectedSession.numberOfStudents}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedSession.tutor && (
                                    <div className="flex items-center gap-3">
                                        <User size={18} className="text-blue-600" />
                                        <div>
                                            <p className="font-medium">Assigned Tutor</p>
                                            <p className="text-gray-600">{selectedSession.tutor.fullName}</p>
                                            <p className="text-sm text-gray-500">{selectedSession.tutor.school}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="font-medium">Payment Status</p>
                                        <p className={`flex items-center gap-1 ${selectedSession.payment ? 'text-green-600' : 'text-red-600'}`}>
                                            <span className={`h-2 w-2 ${selectedSession.payment ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span>
                                            <span>{selectedSession.payment ? `Paid - $${selectedSession.price}` : 'Pending'}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LSAT Goals */}
                        <div className="mt-6 space-y-4">
                            <h3 className="font-semibold text-blue-900 border-b pb-2">LSAT Goals & Background</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium">Current Score</p>
                                    <p className="text-gray-600">{selectedSession.currentScore || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Target Score</p>
                                    <p className="text-gray-600">{selectedSession.targetScore}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Challenging Areas</p>
                                    <p className="text-gray-600">{selectedSession.weakAreas}</p>
                                </div>

                                <div>
                                    <p className="font-medium">Study Materials</p>
                                    <p className="text-gray-600">{selectedSession.studyMaterials || 'Not specified'}</p>
                                </div>

                                <div>
                                    <p className="font-medium">Previous Tutoring</p>
                                    <p className="text-gray-600">{selectedSession.previousTutoring}</p>
                                </div>

                                <div>
                                    <p className="font-medium">Session Goals</p>
                                    <p className="text-gray-600">{selectedSession.specificGoals}</p>
                                </div>
                            </div>

                            {selectedSession.notes && (
                                <div>
                                    <p className="font-medium">Additional Notes</p>
                                    <p className="text-gray-600">{selectedSession.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Documents */}
                        {selectedSession.document && selectedSession.document.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-semibold text-blue-900 border-b pb-2 mb-3">Uploaded Documents</h3>
                                <div className="space-y-2">
                                    {selectedSession.document.map((doc, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <FileDownIcon size={16} className="text-blue-600" />
                                            <Link
                                                target="_blank"
                                                to={doc}
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                {cleanFileName(decodeURIComponent(doc))}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
                            {!selectedSession.sessionCompleted && selectedSession.status && (
                                <button
                                    onClick={() => {
                                        handleMarkAsCompleted(selectedSession._id);
                                        setShowSessionDetails(false);
                                    }}
                                    className="bg-blue-600 py-2 px-4 rounded text-white cursor-pointer flex items-center gap-2 hover:bg-blue-700 transition-colors"
                                >
                                    <Check size={18} />
                                    <span>Mark Session Done</span>
                                </button>
                            )}

                            <button
                                onClick={() => setShowSessionDetails(false)}
                                className="border border-gray-300 py-2 px-4 rounded text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </section>
            }

            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full relative">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All LSAT Sessions</h2>
                    <p className="text-gray-600">Track and manage all LSAT tutoring sessions. Monitor session status, view student details, and manage session completion.</p>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent LSAT Sessions</h3>
                            <p className="text-sm text-gray-600">
                                Total: {allSessions ? allSessions.length : 0} sessions
                            </p>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center py-3 border-b-2 border-b-blue-100 text-sm font-semibold">
                                <h5>Student</h5>
                                <h5>Session Type</h5>
                                <h5>Date & Time</h5>
                                <h5>Tutor</h5>
                                <h5>Payment</h5>
                                <h5>Status</h5>
                                <h5>Actions</h5>
                            </div>

                            {
                                allSessions
                                    ?
                                    (
                                        <>
                                            <div className="hidden sm:block">
                                                {
                                                    allSessions.map(session => (
                                                        <div key={session._id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center py-4 text-gray-600 border-b border-blue-50 text-sm">

                                                            <div>
                                                                <p className="text-blue-600 font-medium">
                                                                    <Link to={`mailto:${session.email}`}>{session.fullName}</Link>
                                                                </p>
                                                                <p className="text-xs text-gray-500">{session.email}</p>
                                                            </div>

                                                            <div>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.sessionType === 'free' ? 'bg-green-100 text-green-800' :
                                                                    session.sessionType === 'one-on-one' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-purple-100 text-purple-800'
                                                                    }`}>
                                                                    {getSessionTypeDisplay(session.sessionType)}
                                                                </span>
                                                            </div>

                                                            <p className="text-sm">
                                                                {session.dateTime ? new Date(session.dateTime).toLocaleDateString() : 'Not Scheduled'}
                                                                <br />
                                                                <span className="text-xs text-gray-500">
                                                                    {session.dateTime ? new Date(session.dateTime).toLocaleTimeString() : ''}
                                                                </span>
                                                            </p>

                                                            <p className="text-sm">
                                                                {session.tutor ? session.tutor.fullName : 'Not Assigned'}
                                                            </p>

                                                            <p className={`flex items-center gap-1 ${session.payment ? 'text-green-600' : 'text-red-600'}`}>
                                                                <span className={`h-2 w-2 ${session.payment ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span>
                                                                <span className="text-sm">
                                                                    {session.payment ? `$${session.price}` : 'Pending'}
                                                                </span>
                                                            </p>

                                                            <div className="space-y-1">
                                                                <p className={`flex items-center gap-1 ${session.sessionCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                                                                    <span className={`h-2 w-2 ${session.sessionCompleted ? 'bg-green-600' : 'bg-orange-600'} rounded-full`}></span>
                                                                    <span className="text-sm">{session.sessionCompleted ? 'Done' : 'Pending'}</span>
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-col gap-2">
                                                                <button
                                                                    onClick={() => handleViewDetails(session)}
                                                                    className="bg-blue-600 py-1 px-3 rounded text-white cursor-pointer text-sm hover:bg-blue-700 transition-colors"
                                                                >
                                                                    View Details
                                                                </button>
                                                                {!session.sessionCompleted && (
                                                                    <button
                                                                        onClick={() => handleMarkAsCompleted(session._id)}
                                                                        className="bg-green-600 py-1 px-3 rounded text-white cursor-pointer text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                                                                    >
                                                                        <Check size={14} />
                                                                        <span>Done</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>

                                            {/* Mobile View */}
                                            <div className="sm:hidden">
                                                {
                                                    allSessions.map(session => (
                                                        <div key={session._id} className="flex flex-col gap-3 py-4 text-gray-600 border-b border-blue-50">

                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="text-blue-600 font-medium">
                                                                        <Link to={`mailto:${session.email}`}>{session.fullName}</Link>
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">{session.email}</p>
                                                                </div>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.sessionType === 'free' ? 'bg-green-100 text-green-800' :
                                                                    session.sessionType === 'one-on-one' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-purple-100 text-purple-800'
                                                                    }`}>
                                                                    {getSessionTypeDisplay(session.sessionType)}
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <p className="font-medium">Date & Time</p>
                                                                    <p>{session.dateTime ? new Date(session.dateTime).toLocaleString() : 'Not Scheduled'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">Tutor</p>
                                                                    <p>{session.tutor ? session.tutor.fullName : 'Not Assigned'}</p>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <p className="font-medium">Payment</p>
                                                                    <p className={`flex items-center gap-1 ${session.payment ? 'text-green-600' : 'text-red-600'}`}>
                                                                        <span className={`h-2 w-2 ${session.payment ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span>
                                                                        <span>{session.payment ? `$${session.price}` : 'Pending'}</span>
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">Status</p>
                                                                    <p className={`flex items-center gap-1 ${session.sessionCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                                                                        <span className={`h-2 w-2 ${session.sessionCompleted ? 'bg-green-600' : 'bg-orange-600'} rounded-full`}></span>
                                                                        <span>{session.sessionCompleted ? 'Done' : 'Pending'}</span>
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    onClick={() => handleViewDetails(session)}
                                                                    className="bg-blue-600 py-2 px-4 rounded text-white cursor-pointer text-sm hover:bg-blue-700 transition-colors flex-1 min-w-[120px]"
                                                                >
                                                                    View Details
                                                                </button>
                                                                {!session.sessionCompleted && (
                                                                    <button
                                                                        onClick={() => handleMarkAsCompleted(session._id)}
                                                                        className="bg-green-600 py-2 px-4 rounded text-white cursor-pointer text-sm hover:bg-green-700 transition-colors flex-1 min-w-[120px] flex items-center justify-center gap-1"
                                                                    >
                                                                        <Check size={14} />
                                                                        <span>Done</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </>
                                    )
                                    :
                                    <LoadingSpinner />
                            }
                        </div>
                    </div>
                </div>
            </AdminContainer>
        </section>
    );
}

export default AllLSATSessions;