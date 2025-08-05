import { AdminContainer, AdminSidebar } from "../../components";
import { Trash } from "lucide-react";
import { user } from "../../assets";

function AllUsers() {
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
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Users</h2>
                    <p className="text-gray-600">All your users, one clean view. Efficiently manage profiles and stay informed on every user.</p>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Sessions</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Image</h5>
                                <h5 className="text-lg">User</h5>
                                <h5 className="text-lg">Session</h5>
                                <h5 className="text-lg">Spent</h5>
                                <h5 className="text-lg">Member Since</h5>
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
                                                    <div key={booking._id} className="md:grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                        <img src={user} alt="" className="h-9 w-9 sm:h-12 sm:w-12 object-cover rounded-full border-2 border-blue-100" />

                                                        <p>
                                                            Sahid Khan
                                                        </p>

                                                        <p>12</p>
                                                        <p>$840</p>
                                                        <p>July 25, 2025</p>

                                                        <button className="bg-red-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Trash /></button>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="sm:hidden">
                                            {
                                                adminBookings.map(booking => (
                                                    <div key={booking._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Image:</p>
                                                            <img src={user} alt="" className="h-9 w-9 sm:h-12 sm:w-12 object-cover rounded-full border-2 border-blue-100" />
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">User:</p>
                                                            <p className="text-blue-600 underline">
                                                                Sahid Khan
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Sessions:</p>
                                                            <p>12</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Spent:</p>
                                                            <p>$840</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Member Since:</p>
                                                            <p>July 25, 2025</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Actions:</p>

                                                            <button className="bg-red-600 px-3 py-1 rounded-md text-white max-w-max cursor-pointer">Delete</button>
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

export default AllUsers;