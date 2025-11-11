import { useEffect } from "react";
import { LoadingSpinner, UserContainer, UserSidebar } from "../../components";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Check, FileDownIcon } from "lucide-react";
import { Link } from "react-router";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import cleanFileName from "../../hooks/CleanFileName.jsx";

function AllLSATSessions() {
    const user = useSelector(state => state.user.user);
    const [userLsatSessions, setUserLsatSessions] = useState(null);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();

    useEffect(() => {
        const getUserLsatSessions = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-sessions/user`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

                if (data.success) {
                    setUserLsatSessions(data.data);
                }
            } catch (error) {
                const message = error?.response?.data?.message;
                if (message === 'accessToken') {
                    try {
                        const newAccessToken = await refreshAccessToken();

                        const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-sessions/user`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                        if (data && data.success) {
                            dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                            setUserLsatSessions(data.data);
                        }
                    } catch (error) {
                        const message = error?.response?.data?.message;
                        toast.error(message);
                    }
                } else {
                    toast.error(message);
                }
            }
        }
        getUserLsatSessions();
    }, [])

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
        <section className="flex min-h-[70vh]">
            <UserSidebar />

            <UserContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold my-5 text-blue-950">LSAT Sessions</h2>
                    <p className="text-gray-600">Easily track your consultations and documents in one place.</p>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Sessions - LSAT Tutoring</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center py-3 border-b-2 border-b-blue-100 text-sm font-semibold">
                                <h5>Session Type</h5>
                                <h5>Tutor</h5>
                                <h5>Date & Time</h5>
                                <h5>Payment</h5>
                                <h5>Documents</h5>
                                <h5>Status</h5>
                            </div>

                            {
                                userLsatSessions
                                    ?
                                    (
                                        <>
                                            <div className="hidden sm:block">
                                                {
                                                    userLsatSessions.map(session => (
                                                        <div key={session._id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center py-4 text-gray-600 border-b border-blue-50 text-sm">

                                                            <div>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.sessionType === 'free' ? 'bg-green-100 text-green-800' :
                                                                        session.sessionType === 'one-on-one' ? 'bg-blue-100 text-blue-800' :
                                                                            'bg-purple-100 text-purple-800'
                                                                    }`}>
                                                                    {getSessionTypeDisplay(session.sessionType)}
                                                                </span>
                                                                <p className="text-xs text-gray-500 mt-1">{getSessionDuration(session.sessionType)}</p>
                                                            </div>

                                                            <p className="text-sm">
                                                                {session.tutor ? session.tutor.fullName : 'Not Assigned'}
                                                            </p>

                                                            <p className="text-sm">
                                                                {session.dateTime ? new Date(session.dateTime).toLocaleDateString() : 'Not Scheduled'}
                                                                <br />
                                                                <span className="text-xs text-gray-500">
                                                                    {session.dateTime ? new Date(session.dateTime).toLocaleTimeString() : ''}
                                                                </span>
                                                            </p>

                                                            <p className={`flex items-center gap-1 ${session.payment ? 'text-green-600' : 'text-red-600'}`}>
                                                                <span className={`h-2 w-2 ${session.payment ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span>
                                                                <span className="text-sm">
                                                                    {session.payment ? `$${session.price}` : 'Pending'}
                                                                </span>
                                                            </p>

                                                            <div>
                                                                {
                                                                    session.document && session.document.length > 0 ?
                                                                        session.document.map((doc, index) => (
                                                                            <Link key={index} target="_blank" to={doc} className="flex gap-1 items-center">
                                                                                <FileDownIcon size={14} />
                                                                                <span className="text-blue-600 hover:underline">Document {index + 1}</span>
                                                                            </Link>
                                                                        ))
                                                                        :
                                                                        'Not Attached'
                                                                }
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className={`flex items-center gap-1 ${session.sessionCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                                                                    <span className={`h-2 w-2 ${session.sessionCompleted ? 'bg-green-600' : 'bg-orange-600'} rounded-full`}></span>
                                                                    <span className="text-sm">{session.sessionCompleted ? 'Done' : 'Pending'}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>

                                            {/* Mobile View */}
                                            <div className="sm:hidden">
                                                {
                                                    userLsatSessions.map(session => (
                                                        <div key={session._id} className="flex flex-col gap-3 py-4 text-gray-600 border-b border-blue-50">

                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.sessionType === 'free' ? 'bg-green-100 text-green-800' :
                                                                            session.sessionType === 'one-on-one' ? 'bg-blue-100 text-blue-800' :
                                                                                'bg-purple-100 text-purple-800'
                                                                        }`}>
                                                                        {getSessionTypeDisplay(session.sessionType)}
                                                                    </span>
                                                                    <p className="text-xs text-gray-500 mt-1">{getSessionDuration(session.sessionType)}</p>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <p className="font-medium">Tutor</p>
                                                                    <p>{session.tutor ? session.tutor.fullName : 'Not Assigned'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">Date & Time</p>
                                                                    <p>{session.dateTime ? new Date(session.dateTime).toLocaleString() : 'Not Scheduled'}</p>
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

                                                            <div className="flex gap-2">
                                                                <p className="font-medium">Documents:</p>
                                                                <div>
                                                                    {
                                                                        session.document && session.document.length > 0 ?
                                                                            session.document.map((doc, index) => (
                                                                                <Link key={index} target="_blank" to={doc} className="flex gap-1 items-center">
                                                                                    <FileDownIcon size={14} />
                                                                                    <span className="text-blue-600 hover:underline">Document {index + 1}</span>
                                                                                </Link>
                                                                            ))
                                                                            :
                                                                            'Not Attached'
                                                                    }
                                                                </div>
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
            </UserContainer>
        </section>
    );
}

export default AllLSATSessions;