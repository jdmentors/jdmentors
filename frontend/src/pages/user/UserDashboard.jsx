import { useEffect } from "react";
import { UserContainer, UserSidebar } from "../../components";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";
import { File, FileCheck, FileDownIcon, Video } from "lucide-react";
import { Link } from "react-router";

// const userSessions = [
//     {
//         "_id": "67f76839994a731e97d3b8ce",
//         "user": 1,
//         "room": 2,
//         "hotel": 3,
//         "checkInDate": "2025-04-30T00:00:00.000Z",
//         "checkOutDate": "2025-05-01T00:00:00.000Z",
//         "totalPrice": 299,
//         "guests": 1,
//         "status": "pending",
//         "paymentMethod": "Stripe",
//         "isPaid": false,
//         "createdAt": "2025-04-10T06:42:01.529Z",
//         "updatedAt": "2025-04-10T06:43:54.520Z",
//         "__v": 0
//     },

//     {
//         "_id": "47g5g239994a731e97d3b8ce",
//         "user": 1,
//         "room": 2,
//         "hotel": 3,
//         "checkInDate": "2025-04-30T00:00:00.000Z",
//         "checkOutDate": "2025-05-01T00:00:00.000Z",
//         "totalPrice": 299,
//         "guests": 1,
//         "status": "pending",
//         "paymentMethod": "Stripe",
//         "isPaid": false,
//         "createdAt": "2025-04-10T06:42:01.529Z",
//         "updatedAt": "2025-04-10T06:43:54.520Z",
//         "__v": 0
//     },

// ]

function UserDashboard() {
    const user = useSelector(state => state.user.user);
    const [userSessions, setUserSessions] = useState(null);

    useEffect(() => {
        const getUserSessions = async () => {
            try {
                // const { data } = await axios.get('/api/v1/Sessions/user', { headers: { Authorization: `Bearer ${accessToken}` } });

                // if (data.success) {
                //     setUserSessions(data.userSessions);
                // }
            } catch (error) {
                console.error(error);
                toast.error(error.message);
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

                        {/* <div className="max-w-full overflow-x-auto">
                            <table className="">
                                <thead className="border-gray-100 border-y">
                                    <tr>
                                        <th className="py-3 font-medium text-gray-600 text-start">Services</th>
                                        <th className="py-3 font-medium text-gray-600 text-start">Duration</th>
                                        <th className="py-3 font-medium text-gray-600 text-start">Price</th>
                                        <th className="py-3 font-medium text-gray-600 text-start">Document</th>
                                        <th className="py-3 font-medium text-gray-600 text-start">Status</th>
                                    </tr>
                                </thead>
                                    
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="">
                                        <td className=" py-3">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <p className="font-medium text-gray-800 text-theme-sm">Personal Statement Review</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className=" py-3 text-gray-500 text-theme-sm">1 Hour</td>
                                        <td className=" py-3 text-gray-500 text-theme-sm">$60</td>
                                        <td className=" py-3 text-gray-500 text-theme-sm flex items-center gap-2"><FileCheck /> <span className="text-blue-500 hover:underline cursor-pointer">file.pdf</span></td>
                                        
                                        <td className=" py-3 text-gray-500 text-theme-sm">
                                            <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-green-600">Delivered/Pending
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> */}

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
                                &&
                                (
                                    <>
                                        <div className="hidden sm:block">
                                            {
                                                userSessions.map(booking => (
                                                    <div key={booking._id} className="md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                        <Link to="/" className="text-gray-800">
                                                            Personal Statement Review
                                                        </Link>

                                                        <p>1 pm Aug 10, 2025</p>
                                                        <p>$60</p>
                                                        <Link to="/" className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-500 hover:underline">file.pdf</span></Link>

                                                        <div>
                                                            <p className={`flex items-center gap-1 ${booking.isPaid ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${booking.isPaid ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{booking.isPaid ? 'Paid' : 'Unpaid'}</span></p>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="sm:hidden">
                                            {
                                                userSessions.map(booking => (
                                                    <div key={booking._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                        <div className="flex gap-2">
                                                            <p className="text-gray-800">Service:</p>
                                                            <Link to="/" className="text-gray-600">
                                                                Personal Statement Review
                                                            </Link>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <p className="text-gray-800">Preferred Time:</p>
                                                            <p>1 pm Aug 10, 2025</p>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <p className="text-gray-800">Price:</p>
                                                            <p>$60</p>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <p className="text-gray-800">Doc(s):</p>
                                                            <Link to="/" className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-500 hover:underline">file.pdf</span></Link>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <p className="text-gray-800">Status:</p>
                                                            <p className={`flex items-center gap-1 ${booking.isPaid ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${booking.isPaid ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{booking.isPaid ? 'Paid' : 'Unpaid'}</span></p>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </UserContainer>
        </section>
    );
}

export default UserDashboard;