import { useEffect } from "react";
import { AdminContainer, AdminSidebar, LoadingSpinner, UserPopUp } from "../../components";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Check, FileDownIcon } from "lucide-react";
import { Link } from "react-router";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import cleanFileName from "../../hooks/CleanFileName.jsx";

function AllSessions() {
    const [showUserPopUp, setShowUserPopUp] = useState(false);
    const user = useSelector(state => state.user.user);
    const [allSessions, setAllSessions] = useState(null);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();
    const [userPopUpEmail, setUserPopUpEmail] = useState(null);

    useEffect(() => {
        const getAllSessions = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/sessions/all`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

                if (data.success) {
                    setAllSessions(data.data);
                }
            } catch (error) {
                const message = error?.response?.data?.message;
                if (message === 'accessToken') {
                    try {
                        const newAccessToken = await refreshAccessToken();

                        const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/sessions/all`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

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

    const handleStatusUpdate = async (id) => {
        try {
            const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/sessions/status/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                setAllSessions(sessions => {
                    return sessions.map(session => {
                        if (session._id === id) {
                            return { ...session, status: data.data.status }
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

                    const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/sessions/status/${id}`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        setAllSessions(sessions => {
                            return sessions.map(session => {
                                if (session._id === id) {
                                    return { ...session, status: data.data.status }
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

    const handleShowUserPopUp = (email) => {
        setUserPopUpEmail(email);
        setShowUserPopUp(true);
    }

    return (
        <section className="flex min-h-[90vh]">
            {
                showUserPopUp &&
                <section className="top-0 left-0 right-0 bottom-0 bg-black/70 z-50 flex items-center justify-center fixed">
                    <UserPopUp email={userPopUpEmail} funToRun={setShowUserPopUp} />
                </section>
            }

            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Sessions - Admissions</h2>
                    <p className="text-gray-600">Track and manage every scheduled session or consultation for admission in one place. Stay informed and ensure seamless communication between users and experts.</p>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Sessions - Admissions</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[2fr_1fr_2fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Service</h5>
                                <h5 className="text-lg">User</h5>
                                <h5 className="text-lg">Add-ons & Extras</h5>
                                <h5 className="text-lg">Payment</h5>
                                <h5 className="text-lg">Document</h5>
                                <h5 className="text-lg">Status</h5>
                                <h5 className="text-lg">Action</h5>
                            </div>

                            {
                                allSessions
                                    ?
                                    (
                                        <>
                                            <div className="hidden sm:block">
                                                {
                                                    allSessions.map(session => (
                                                        <div key={session._id} className="md:grid grid-cols-[2fr_1fr_2fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                            <p className="text-gray-800">
                                                                {session?.service?.title || 'Unknown'}
                                                            </p>

                                                            <p className="text-blue-600 underline">
                                                                <Link to={`mailto:${session.email}`}>{session.fullName}</Link>
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

                                                            {
                                                                !session.status
                                                                &&
                                                                <button onClick={() => handleStatusUpdate(session._id)} className="bg-green-600 py-2 px-5 rounded text-white cursor-pointer flex items-center gap-1 max-w-max"><Check size={20} /> <span>Done</span></button>
                                                            }

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className="sm:hidden">
                                                {
                                                    allSessions.map(session => (
                                                        <div key={session._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Service:</p>
                                                                <p className="text-gray-600">
                                                                    {session?.service?.title || 'Unknown'}
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">User:</p>
                                                                <p className="text-blue-600 underline">
                                                                    <Link to={`mailto:${session.email}`}>{session.fullName}</Link>
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

                                                            {
                                                                !session.status
                                                                &&
                                                                <button onClick={() => handleStatusUpdate(session._id)} className="bg-green-600 py-2 px-5 rounded text-white cursor-pointer flex items-center gap-1 max-w-max"><Check size={20} /> <span>Done</span></button>
                                                            }
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

export default AllSessions;