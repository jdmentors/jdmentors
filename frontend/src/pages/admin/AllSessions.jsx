import { useEffect } from "react";
import { AdminContainer, AdminSidebar, UserPopUp } from "../../components";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";
import { DollarSign, FileDownIcon, Newspaper, Settings, User, UserRound, VideoIcon } from "lucide-react";
import { Link } from "react-router";

const adminBookings = [
    {
        "_id": "67f76839994a731e97d3b8ce",
        "user": 'Sahid Khan',
        "room": 2,
        "hotel": 3,
        "checkInDate": "2025-04-30T00:00:00.000Z",
        "checkOutDate": "2025-05-01T00:00:00.000Z",
        "totalPrice": 299,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Stripe",
        "isPaid": false,
        "createdAt": "2025-04-10T06:42:01.529Z",
        "updatedAt": "2025-04-10T06:43:54.520Z",
        "__v": 0
    },

    {
        "_id": "47g5g239994a731e97d3b8ce",
        "user": 'Sana',
        "room": 2,
        "hotel": 3,
        "checkInDate": "2025-04-30T00:00:00.000Z",
        "checkOutDate": "2025-05-01T00:00:00.000Z",
        "totalPrice": 299,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Stripe",
        "isPaid": false,
        "createdAt": "2025-04-10T06:42:01.529Z",
        "updatedAt": "2025-04-10T06:43:54.520Z",
        "__v": 0
    },

]

function AllSessions() {
    const accessToken = useSelector(state => state.user.user.accessToken);
    const [showUserPopUp, setShowUserPopUp] = useState(false);
    // const [adminBookings, setadminBookings] = useState(null);

    // useEffect(() => {
    //     const getadminBookings = async () => {
    //         try {
    //             // const { data } = await axios.get('/api/v1/bookings/user', { headers: { Authorization: `Bearer ${accessToken}` } });

    //             // if (data.success) {
    //             //     setadminBookings(data.adminBookings);
    //             // }
    //         } catch (error) {
    //             console.error(error);
    //             toast.error(error.message);
    //         }
    //     }
    //     getadminBookings();
    // }, [])

    return (
        <section className="flex min-h-[90vh]">
            {
                showUserPopUp &&
                <section className="top-0 left-0 right-0 bottom-0 bg-black/70 z-50 flex items-center justify-center fixed">
                    <UserPopUp funToRun={setShowUserPopUp} />
                </section>
            }

            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Sessions</h2>
                    <p className="text-gray-600">Track and manage every scheduled session or consultation in one place. Stay informed and ensure seamless communication between users and experts.</p>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Sessions</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Service</h5>
                                <h5 className="text-lg">User</h5>
                                <h5 className="text-lg">Duration</h5>
                                <h5 className="text-lg">Price</h5>
                                <h5 className="text-lg">Document</h5>
                                <h5 className="text-lg">Status</h5>
                            </div>

                            {
                                adminBookings
                                &&
                                (
                                    <>
                                        <div className="hidden sm:block">
                                            {
                                                adminBookings.map(booking => (
                                                    <div key={booking._id} className="md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                        <p className="text-gray-800">
                                                            Personal Statement Review
                                                        </p>

                                                        <p onClick={() => setShowUserPopUp(true)} className="text-blue-600 underline cursor-pointer">
                                                            Sahid Khan
                                                        </p>

                                                        <p>1 Hour</p>
                                                        <p>$60</p>

                                                        <Link to="/" className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">file.pdf</span></Link>


                                                        <p className={`flex items-center gap-1 ${booking.isPaid ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${booking.isPaid ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{booking.isPaid ? 'Paid' : 'Unpaid'}</span></p>

                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="sm:hidden">
                                            {
                                                adminBookings.map(booking => (
                                                    <div key={booking._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                        <div className="flex gap-2">
                                                            <p className="text-gray-800">Service:</p>
                                                            <p className="text-gray-600">
                                                                Personal Statement Review
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <p className="text-gray-800">User:</p>
                                                            <p onClick={() => setShowUserPopUp(true)} className="text-blue-600 underline">
                                                                Sahid Khan
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <p className="text-gray-800">Duration:</p>
                                                            <p>1 Hour</p>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <p className="text-gray-800">Price:</p>
                                                            <p>$60</p>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <p className="text-gray-800">Doc(s):</p>
                                                            <Link to="/" className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">file.pdf</span></Link>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <p className="text-gray-800">Status:</p>
                                                            <p className={`flex items-center gap-1 ${booking.isPaid ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${booking.isPaid ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{booking.isPaid ? 'Done' : 'Pending'}</span></p>
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
            </AdminContainer>
        </section>
    );
}

export default AllSessions;