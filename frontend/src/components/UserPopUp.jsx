import { DollarSign, Laptop, Mail, Phone, User, UserPlus, X } from "lucide-react";
import { Link } from "react-router";
import { user as UserImg } from "../assets";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

function UserPopUp({ funToRun, id }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/users/single/${id}`);

                if (data && data.success) {
                    setUser(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getUser();
    }, [])

    return (
        user
        &&
        (
            <div className="text-gray-600 shadow-2xl shadow-blue-300/60 w-4/5 sm:w-sm bg-white rounded-xl overflow-hidden">
                <div className="px-5 py-3 flex justify-between items-center bg-blue-600 text-white">
                    <p className="text-lg">Sahid Khan</p>
                    <X onClick={() => funToRun(false)} className="cursor-pointer" />
                </div>

                <div className="p-5 flex flex-col gap-3">
                    <p className="flex gap-2 items-center"><User /> <span>{user[0].fullName}</span> </p>

                    <p className="flex gap-2 items-center"><Mail size={20} /> <Link to={`mailto:${user[0].email}`} className="text-blue-600 underline">{user[0].email}</Link> </p>

                    <p className="flex gap-2 items-center"><Phone size={20} /> <Link to={`tel:${user[0].phone}`} className="text-blue-600 underline">{user[0].phone}</Link></p>

                    <p className="flex gap-2 items-center"><UserPlus /> <span>{new Date(user[0].createdAt).toDateString()}</span> </p>

                    <p className="flex gap-2 items-center"><Laptop /> <span>Sessions: </span> <span>{user[0].sessionCount}</span> </p>

                    <p className="flex gap-2 items-center"><DollarSign /> <span>Spent:</span> <span>${user[0].totalSpent}</span> </p>
                </div>
            </div>
        )
    );
}

export default UserPopUp;