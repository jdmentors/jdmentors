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

function UserDashboard() {
    const user = useSelector(state => state.user.user);
    const [userSessions, setUserSessions] = useState(null);
    const [userAccommodations, setUserAccommodations] = useState(null);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();

    useEffect(() => {
        const getUserSessions = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/sessions/user`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

                if (data.success) {
                    setUserSessions(data.data);
                }
            } catch (error) {
                const message = error?.response?.data?.message;
                if (message === 'accessToken') {
                    try {
                        const newAccessToken = await refreshAccessToken();

                        const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/sessions/user`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                        if (data && data.success) {
                            dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                            setUserSessions(data.data);
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
        getUserSessions();

        const getUserAccommodations = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/accommodations/user`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

                if (data.success) {
                    setUserAccommodations(data.data);
                }
            } catch (error) {
                const message = error?.response?.data?.message;
                if (message === 'accessToken') {
                    try {
                        const newAccessToken = await refreshAccessToken();

                        const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/accommodations/user`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                        if (data && data.success) {
                            dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                            setUserAccommodations(data.data);
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
        getUserAccommodations();
    }, [])

    return (
        <section className="flex min-h-[70vh]">
            <UserSidebar />

            <UserContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold my-5 text-blue-950">Dashboard</h2>
                    <p className="text-gray-600">Easily track your consultations and documents in one place.</p>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Sessions - Admissions</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Service</h5>
                                <h5 className="text-lg">Add-ons & Extras</h5>
                                <h5 className="text-lg">Payment</h5>
                                <h5 className="text-lg">Document</h5>
                                <h5 className="text-lg">Status</h5>
                            </div>

                            {
                                userSessions
                                    ?
                                    (
                                        <>
                                            <div className="hidden sm:block">
                                                {
                                                    userSessions.map(session => (
                                                        <div key={session._id} className="md:grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                            <p className="text-gray-800">
                                                                {session.service.title}
                                                            </p>

                                                            <div>
                                                                {
                                                                    session.addonsAndExtras && session.addonsAndExtras.length > 0
                                                                        ?
                                                                        session.addonsAndExtras.map((addonAndExtra) => {
                                                                            return (
                                                                                <p key={addonAndExtra}>{addonAndExtra}</p>
                                                                            )
                                                                        })
                                                                        :
                                                                        <p>Not Included</p>
                                                                }
                                                            </div>

                                                            <p className={`flex items-center gap-1 ${session.payment ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${!session.payment && 'bg-red-600'} rounded-full`}></span> <span>{session.payment ? `$${session.price}` : 'Pending'}</span></p>

                                                            <div>
                                                                {
                                                                    session.document.length > 0 ? session.document.map((doc) => {
                                                                        return (
                                                                            <Link key={doc} target="_blank" to={`${doc}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">{cleanFileName(decodeURIComponent(doc))}</span></Link>
                                                                        )
                                                                    })
                                                                        :
                                                                        'Not Attached'
                                                                }
                                                            </div>

                                                            <p className={`flex items-center gap-1 ${session.status ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${session.status ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{session.status ? 'Done' : 'Pending'}</span></p>

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className="sm:hidden">
                                                {
                                                    userSessions.map(session => (
                                                        <div key={session._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Service:</p>
                                                                <p className="text-gray-600">
                                                                    {session.service.title}
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Add-ons & Extras:</p>
                                                                <div>
                                                                    {
                                                                        session.addonsAndExtras && session.addonsAndExtras.length > 0
                                                                            ?
                                                                            session.addonsAndExtras.map((addonAndExtra) => {
                                                                                return (
                                                                                    <p key={addonAndExtra}>{addonAndExtra}</p>
                                                                                )
                                                                            })
                                                                            :
                                                                            <p>Not Included</p>
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Price:</p>
                                                                <p>${session.price}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Doc(s):</p>
                                                                <div>
                                                                    {
                                                                        session.document.length > 0 ? session.document.map((doc) => {
                                                                            return (
                                                                                <Link key={doc} target="_blank" to={`${doc}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">{cleanFileName(decodeURIComponent(doc))}</span></Link>
                                                                            )
                                                                        })
                                                                            :
                                                                            'Not Attached'
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Status:</p>
                                                                <p className={`flex items-center gap-1 ${session.status ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${session.status ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{session.status ? 'Done' : 'Pending'}</span></p>
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

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Sessions - Accommodations</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Exam/Program</h5>
                                <h5 className="text-lg">Exam/Test Date</h5>
                                <h5 className="text-lg">Documentation</h5>
                                <h5 className="text-lg">Payment</h5>
                                <h5 className="text-lg">Document</h5>
                                <h5 className="text-lg">Status</h5>
                            </div>

                            {
                                userAccommodations
                                    ?
                                    (
                                        <>
                                            <div className="hidden sm:block">
                                                {
                                                    userAccommodations.map(accommodation => (
                                                        <div key={accommodation._id} className="md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">

                                                            <div>
                                                                {
                                                                    accommodation.exam && accommodation.exam.length > 0
                                                                        ?
                                                                        accommodation.exam
                                                                            .map(ex => ex.split(',')[0])
                                                                            .join(', ')
                                                                        :
                                                                        'Not Specified'
                                                                }
                                                            </div>

                                                            <p className="">
                                                                {accommodation.dateTime ? new Date(accommodation.dateTime).toDateString() : 'Not Specified'}
                                                            </p>

                                                            <p className="">
                                                                {accommodation.supportingDocumentation || 'Not Specified'}
                                                            </p>

                                                            <p className={`flex items-center gap-1 ${accommodation.payment ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${!accommodation.payment && 'bg-red-600'} rounded-full`}></span> <span>{accommodation.payment ? `$${accommodation.price}` : 'Pending'}</span></p>

                                                            <div>
                                                                {
                                                                    accommodation.document.length > 0 ? accommodation.document.map((doc) => {
                                                                        return (
                                                                            <Link key={doc} target="_blank" to={`${doc}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">{cleanFileName(decodeURIComponent(doc))}</span></Link>
                                                                        )
                                                                    })
                                                                        :
                                                                        'Not Attached'
                                                                }
                                                            </div>

                                                            <p className={`flex items-center gap-1 ${accommodation.status ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${accommodation.status ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{accommodation.status ? 'Done' : 'Pending'}</span></p>

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className="sm:hidden">
                                                {
                                                    userAccommodations.map(accommodation => (
                                                        <div key={accommodation._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Exam/Program:</p>
                                                                <div>
                                                                    {
                                                                        accommodation.exam && accommodation.exam.length > 0
                                                                            ?
                                                                            accommodation.exam
                                                                                .map(ex => ex.split(',')[0])
                                                                                .join(', ')
                                                                            :
                                                                            'Not Specified'
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Exam/Test Date:</p>
                                                                <p>{accommodation.dateTime ? new Date(accommodation.dateTime).toDateString() : 'Not Specified'}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Documentation:</p>
                                                                <p>{accommodation.supportingDocumentation || 'Not Specified'}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Payment:</p>
                                                                <p className={`flex items-center gap-1 ${accommodation.payment ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${!accommodation.payment && 'bg-red-600'} rounded-full`}></span> <span>{accommodation.payment ? `$${accommodation.price}` : 'Pending'}</span></p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Doc(s):</p>
                                                                <div>
                                                                    {
                                                                        accommodation.document.length > 0 ? accommodation.document.map((doc) => {
                                                                            return (
                                                                                <Link key={doc} target="_blank" to={`${doc}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">{cleanFileName(decodeURIComponent(doc))}</span></Link>
                                                                            )
                                                                        })
                                                                            :
                                                                            'Not Attached'
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Status:</p>
                                                                <p className={`flex items-center gap-1 ${accommodation.status ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${accommodation.status ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{accommodation.status ? 'Done' : 'Pending'}</span></p>
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

export default UserDashboard;