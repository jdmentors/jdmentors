import { useEffect } from "react";
import { AdminContainer, AdminSidebar, LoadingSpinner, UserPopUp } from "../../components";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Check, DollarSign, FileDownIcon, Newspaper, Settings, User, UserRound, VideoIcon } from "lucide-react";
import { Link } from "react-router";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";

function AdminDashboard() {
    const [showUserPopUp, setShowUserPopUp] = useState(false);
    const user = useSelector(state => state.user.user);
    const [allSessions, setAllSessions] = useState(null);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();
    const [dashboardData, setDashboardData] = useState(null);
    const [userPopUpId, setUserPopUpId] = useState(null);

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

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/dashboard`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

                if (data && data.success) {
                    setDashboardData(data.data);
                }
            } catch (error) {
                const message = error?.response?.data?.message;
                if (message === 'accessToken') {
                    try {
                        const newAccessToken = await refreshAccessToken();

                        const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/dashboard`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                        if (data && data.success) {
                            dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                            setDashboardData(data.data);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
        getDashboardData();
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
                    console.error(error?.response?.data?.message);
                }
            }
        }
    }

    const handleShowUserPopUp = (id) => {
        setUserPopUpId(id);
        setShowUserPopUp(true);
    }

    return (
        <section className="flex min-h-[90vh] relative">
            {
                showUserPopUp &&
                <section className="top-0 left-0 right-0 bottom-0 bg-black/70 z-50 flex items-center justify-center fixed">
                    <UserPopUp id={userPopUpId} funToRun={setShowUserPopUp} />
                </section>
            }

            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Dashboard</h2>
                    <p className="text-gray-600">Monitor your sessions and docs-all in one place. Stay updated with real-time insights to ensure smooth operations.</p>
                </div>

                {/* Stats section */}
                {
                    dashboardData
                        ?
                        (
                            <div className="my-10 max-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                                <div className="flex justify-between gap-10 lg:gap-5 bg-blue-50 items-center border-2 border-blue-100 rounded-xl p-7">
                                    <div className="bg-blue-100 p-3 rounded-md">
                                        <User size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Users</p>
                                        <p className="text-2xl text-blue-950 font-semibold">{dashboardData?.userCount}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-10 bg-blue-50 items-center border-2 border-blue-100 rounded-xl p-7">
                                    <div className="bg-blue-100 p-3 rounded-md">
                                        <VideoIcon size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Sessions</p>
                                        <p className="text-2xl text-blue-950 font-semibold">{dashboardData?.sessionCount}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-10 bg-blue-50 items-center border-2 border-blue-100 rounded-xl p-7">
                                    <div className="bg-blue-100 p-3 rounded-md">
                                        <DollarSign size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Revenue</p>
                                        <p className="text-2xl text-blue-950 font-semibold">${dashboardData?.revenue[0]?.totalPrice}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-10 bg-blue-50 items-center border-2 border-blue-100 rounded-xl p-7">
                                    <div className="bg-blue-100 p-3 rounded-md">
                                        <Settings size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Services</p>
                                        <p className="text-2xl text-blue-950 font-semibold">{dashboardData?.serviceCount}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-10 bg-blue-50 items-center border-2 border-blue-100 rounded-xl p-7">
                                    <div className="bg-blue-100 p-3 rounded-md">
                                        <Newspaper size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Blogs</p>
                                        <p className="text-2xl text-blue-950 font-semibold">{dashboardData?.blogCount}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-10 bg-blue-50 items-center border-2 border-blue-100 rounded-xl p-7">
                                    <div className="bg-blue-100 p-3 rounded-md">
                                        <UserRound size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Admins</p>
                                        <p className="text-2xl text-blue-950 font-semibold">{dashboardData?.adminCount}</p>
                                    </div>
                                </div>
                            </div>
                        )
                        :
                        <LoadingSpinner />
                }

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Sessions</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Service</h5>
                                <h5 className="text-lg">User</h5>
                                <h5 className="text-lg">Preferred Time</h5>
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
                                                        <div key={session._id} className="md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                            <p className="text-gray-800">
                                                                {session.service.title}
                                                            </p>

                                                            <p onClick={() => handleShowUserPopUp(session.user._id)} className="text-blue-600 underline cursor-pointer">
                                                                {session.user.fullName}
                                                            </p>

                                                            <p>{new Date(session.dateTime).toDateString() + " " + `(${new Date(session.dateTime).toLocaleTimeString()})`}</p>

                                                            <p className={`flex items-center gap-1 ${session.payment ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${!session.payment && 'bg-red-600'} rounded-full`}></span> <span>{session.payment ? `$${session.service.price}` : 'Pending'}</span></p>

                                                            <Link target="_blank" to={`${session.document}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">file</span></Link>

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
                                                                    {session.service.title}
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">User:</p>
                                                                <p onClick={() => handleShowUserPopUp(session.user._id)} className="text-blue-600 underline">
                                                                    {session.user.fullName}
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Preferred Time:</p>
                                                                <p>{new Date(session.dateTime).toDateString() + " " + `(${new Date(session.dateTime).toLocaleTimeString()})`}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Price:</p>
                                                                <p>${session.service.price}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Doc(s):</p>
                                                                <Link target="_blank" to={`${session.document}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">file.pdf</span></Link>
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

export default AdminDashboard;