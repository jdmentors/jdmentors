import { useEffect } from "react";
import { LoadingSpinner, UserContainer, UserSidebar } from "../../components";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { FileDownIcon } from "lucide-react";
import { Link } from "react-router";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";

function UserDashboard() {
    const user = useSelector(state => state.user.user);
    const [userSessions, setUserSessions] = useState(null);
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
                }else{
                    toast.error(message);
                }
            }
        }
        getUserSessions();
    }, [])

    return (
        <section className="flex min-h-[70vh]">
            <UserSidebar />

            <UserContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold my-5 text-blue-950">Dashboard</h2>
                    <p className="text-gray-600">Monitor your consultations and docs-all in one place. Stay updated with real-time insights to ensure smooth operations.</p>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Sessions</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Services</h5>
                                <h5 className="text-lg">Preferred Time</h5>
                                <h5 className="text-lg">Price</h5>
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
                                                    <div key={session._id} className="md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                        <Link target="_blank" to={`/checkout/${session.service._id}`} className="text-gray-800">
                                                            {session.service.title}
                                                        </Link>

                                                        <p>{new Date(session.dateTime).toDateString() + " " + `(${new Date(session.dateTime).toLocaleTimeString()})`}</p>
                                                        <p>${session.service.price}</p>

                                                        <Link target="_blank" to={`${session.document}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-500 hover:underline">file</span></Link>

                                                        <div>
                                                            <p className={`flex items-center gap-1 ${session.status ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${session.status ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{session.status ? 'Done' : 'Pending'}</span></p>
                                                        </div>
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
                                                            <Link target="_blank" to={`/checkout/${session.service._id}`} className="text-gray-600">
                                                                {session.service.title}
                                                            </Link>
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
                                                            <Link target="_blank" to={`${session.document}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-500 hover:underline">file</span></Link>
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
            </UserContainer>
        </section>
    );
}

export default UserDashboard;