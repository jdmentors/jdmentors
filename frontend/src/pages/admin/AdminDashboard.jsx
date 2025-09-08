import { useEffect } from "react";
import { AdminContainer, AdminSidebar, LoadingSpinner } from "../../components";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { DollarSign, Gift, GraduationCap, Handshake, Newspaper, Package, Puzzle, Settings, User, UserRound, UsersRound } from "lucide-react";
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
    
    return (
        <section className="flex min-h-[90vh] relative">
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
                                        <GraduationCap size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Sessions <br /> (Admission)</p>
                                        <p className="text-2xl text-blue-950 font-semibold">{dashboardData?.sessionCount}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-10 bg-blue-50 items-center border-2 border-blue-100 rounded-xl p-7">
                                    <div className="bg-blue-100 p-3 rounded-md">
                                        <Handshake size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Sessions <br /> (Accommodations)</p>
                                        <p className="text-2xl text-blue-950 font-semibold">{dashboardData?.accommodationCount}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-10 bg-blue-50 items-center border-2 border-blue-100 rounded-xl p-7">
                                    <div className="bg-blue-100 p-3 rounded-md">
                                        <DollarSign size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Revenue <br /> (Admission)</p>
                                        <p className="text-2xl text-blue-950 font-semibold">${dashboardData?.totalRevenue}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-10 bg-blue-50 items-center border-2 border-blue-100 rounded-xl p-7">
                                    <div className="bg-blue-100 p-3 rounded-md">
                                        <DollarSign size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Revenue <br /> (Accommodation)</p>
                                        <p className="text-2xl text-blue-950 font-semibold">${dashboardData?.totalAccommodationRevenue}</p>
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
                                        <Package size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Packages</p>
                                        <p className="text-2xl text-blue-950 font-semibold">{dashboardData?.packageCount}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-10 bg-blue-50 items-center border-2 border-blue-100 rounded-xl p-7">
                                    <div className="bg-blue-100 p-3 rounded-md">
                                        <Puzzle size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Add-ons</p>
                                        <p className="text-2xl text-blue-950 font-semibold">{dashboardData?.addonCount}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-10 bg-blue-50 items-center border-2 border-blue-100 rounded-xl p-7">
                                    <div className="bg-blue-100 p-3 rounded-md">
                                        <Gift size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Extras</p>
                                        <p className="text-2xl text-blue-950 font-semibold">{dashboardData?.extraCount}</p>
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

                                <div className="flex justify-between gap-10 bg-blue-50 items-center border-2 border-blue-100 rounded-xl p-7">
                                    <div className="bg-blue-100 p-3 rounded-md">
                                        <UsersRound size={30} strokeWidth={1.5} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Team</p>
                                        <p className="text-2xl text-blue-950 font-semibold">{dashboardData?.teamCount}</p>
                                    </div>
                                </div>
                            </div>
                        )
                        :
                        <LoadingSpinner />
                }

            </AdminContainer>
        </section>
    );
}

export default AdminDashboard;