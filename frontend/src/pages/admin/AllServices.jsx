import { AdminContainer, AdminSidebar } from "../../components";
import { Pencil, Plus, Trash } from "lucide-react";
import { user } from "../../assets";
import { Link } from "react-router";

function AllServices() {
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
    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full relative">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Services</h2>
                    <p className="text-gray-600">Stay in control of offerings and pricing across your platform and manage all service packages at a glance.</p>

                    <br />

                    <Link className="bg-blue-600 py-3 px-6 rounded-md text-white cursor-pointer sm:absolute sm:right-0 sm:top-0 flex items-center gap-2 justify-start max-w-max" to="/admin/services/add"><Plus size={18} strokeWidth={3} /><span>Add Service</span></Link>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">All Services</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Title</h5>
                                <h5 className="text-lg">Rate</h5>
                                <h5 className="text-lg">Sessions</h5>
                                <h5 className="text-lg">Revenue</h5>
                                <h5 className="text-lg">Status</h5>
                                <h5 className="text-lg">Action</h5>
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
                                                        <p className="text-gray-600">Personal Statement Review</p>

                                                        <p className="">
                                                            $60/hr
                                                        </p>

                                                        <p>41</p>
                                                        <p>$1540</p>
                                                        <label className="relative cursor-pointer">
                                                            <input type="checkbox" onChange={(e) => toggleRoomAvailability(e.target.checked, room._id)} checked={true} className="sr-only peer" />

                                                            <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                            <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                        </label>

                                                        <div className="flex gap-3">
                                                            <button className="bg-green-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Pencil size={18} /></button>
                                                            <button className="bg-red-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Trash size={18} /></button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="sm:hidden">
                                            {
                                                adminBookings.map(booking => (
                                                    <div key={booking._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Title:</p>
                                                            <p className="text-gray-600">Personal Statement Review</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Rate:</p>
                                                            <p>
                                                                $60/hr
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Sessions:</p>
                                                            <p>12</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Revenue:</p>
                                                            <p>$840</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Status:</p>
                                                            <label className="relative cursor-pointer">
                                                                <input type="checkbox" onChange={(e) => toggleRoomAvailability(e.target.checked, room._id)} checked={true} className="sr-only peer" />

                                                                <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                                <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                            </label>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Actions:</p>

                                                            <div className="flex flex-wrap gap-4">
                                                                <button className="bg-green-600 px-3 py-1 rounded-md text-white max-w-max cursor-pointer">Edit</button>
                                                                <button className="bg-red-600 px-3 py-1 rounded-md text-white max-w-max cursor-pointer">Delete</button>
                                                            </div>
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

export default AllServices;