import { useEffect } from "react";
import { AdminContainer, AdminSidebar, LoadingSpinner, UserPopUp } from "../../components";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Check, FileDownIcon, Pencil, Plus, Trash } from "lucide-react";
import { Link } from "react-router";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import cleanFileName from "../../hooks/CleanFileName.jsx";

function AllCoupons() {
    const [showUserPopUp, setShowUserPopUp] = useState(false);
    const user = useSelector(state => state.user.user);
    const [allCoupons, setAllCoupons] = useState(null);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();
    const [userPopUpEmail, setUserPopUpEmail] = useState(null);

    useEffect(() => {
        const getAllCoupons = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/all`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

                if (data && data.success) {
                    setAllCoupons(data.data);
                }
            } catch (error) {
                const message = error?.response?.data?.message;
                if (message === 'accessToken') {
                    try {
                        const newAccessToken = await refreshAccessToken();

                        const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/all`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                        if (data && data.success) {
                            dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                            setAllCoupons(data.data);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
        getAllCoupons();
    }, [])

    const handleUpdateAvailability = async (id, e) => {
        const availabilityStatus = e.target.checked;
        try {
            const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/availability/${id}`, { status: availabilityStatus }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);

                setAllCoupons(coupons => {
                    return coupons.map(coupon => {
                        if (coupon._id.toString() === id.toString()) {
                            return { ...coupon, status: availabilityStatus }
                        } else {
                            return coupon;
                        }
                    })
                })
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupon/availability/${id}`, { status: availabilityStatus }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));

                        setAllCoupons(coupons => {
                            return coupons.map(coupon => {
                                if (coupon._id.toString() === id.toString()) {
                                    return { ...coupon, status: availabilityStatus }
                                } else {
                                    return coupon;
                                }
                            })
                        })
                    }
                } catch (error) {
                    console.error(error);
                }
            }else{
                toast.error(message);
            }
        }
    }

    const handleDeleteCoupon = async (id) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/delete/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllCoupons(prevcoupons => prevcoupons.filter(coupon => coupon._id.toString() !== id.toString()));
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/delete/${id}`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllCoupons(prevcoupons => prevcoupons.filter(coupon => coupon._id.toString() !== id.toString()));
                    }
                } catch (error) {
                    console.error(error);
                }
            }else{
                toast.error(message);
                console.error(error)
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
                <div className="max-w-full relative">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Coupons</h2>
                    <p className="text-gray-600">Create, manage, and monitor all coupons from a single dashboard. Maintain full control to boost engagement and reward users.</p>

                    <br />

                    <Link className="bg-blue-600 py-3 px-6 rounded-md text-white cursor-pointer sm:absolute sm:right-0 sm:top-0 flex items-center gap-2 justify-start max-w-max" to="/admin/coupons/add"><Plus size={18} strokeWidth={3} /><span>Add Coupon</span></Link>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Coupons</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Coupon Code</h5>
                                <h5 className="text-lg">Usage Limit</h5>
                                <h5 className="text-lg">Redeemed</h5>
                                <h5 className="text-lg">Expiration</h5>
                                <h5 className="text-lg">Discount (%)</h5>
                                <h5 className="text-lg">Status</h5>
                                <h5 className="text-lg">Action</h5>
                            </div>

                            {
                                allCoupons
                                    ?
                                    (
                                        <>
                                            <div className="hidden sm:block">
                                                {
                                                    allCoupons.map(coupon => (
                                                        <div key={coupon._id} className="md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                            <p className="text-gray-800">
                                                                {coupon.coupon}
                                                            </p>

                                                            <p>
                                                                {coupon.usage ? coupon.usage : 'Not set'}
                                                            </p>

                                                            <p>
                                                                {coupon.redeemed}
                                                            </p>

                                                            <p>{coupon.expiration ? new Date(coupon.expiration).toDateString() : 'Not Set'}</p>

                                                            <p>{coupon.discount}</p>

                                                            <label className="relative cursor-pointer">
                                                                <input type="checkbox" checked={coupon.status} onChange={(e) => handleUpdateAvailability(coupon._id, e)} className="sr-only peer" />

                                                                <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                                <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                            </label>

                                                            <div className="flex gap-3">
                                                                <Link to={`/admin/coupons/edit/${coupon._id}`} className="bg-green-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Pencil size={18} /></Link>
                                                                <button onClick={() => handleDeleteCoupon(coupon._id)} className="bg-red-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Trash size={18} /></button>
                                                            </div>

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className="sm:hidden">
                                                {
                                                    allCoupons.map(coupon => (
                                                        <div key={coupon._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Coupon Code:</p>
                                                                <p className="text-gray-600">
                                                                    {coupon.coupon}
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Usage Limit:</p>
                                                                <p>
                                                                    {coupon.usage ? coupon.usage : 'Not set'}
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Redeemed:</p>
                                                                <p>{coupon.redeemed}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Expiration:</p>
                                                                <p>{coupon.expiration ? new Date(coupon.expiration).toDateString() : 'Not Set'}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Discount (%):</p>
                                                                <p>{coupon.discount}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Status:</p>
                                                                <label className="relative cursor-pointer">
                                                                    <input type="checkbox" checked={coupon.status} onChange={(e) => handleUpdateAvailability(coupon._id, e)} className="sr-only peer" />

                                                                    <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                                    <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                                </label>
                                                            </div>

                                                            <div className="flex gap-3">
                                                                <Link to={`/admin/coupons/edit/${coupon._id}`} className="bg-green-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Pencil size={18} /></Link>
                                                                <button onClick={() => handleDeleteCoupon(coupon._id)} className="bg-red-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Trash size={18} /></button>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </>
                                    )
                                    :
                                    Array.isArray(allCoupons) && allCoupons.length === 0
                                    ? 
                                    ''
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

export default AllCoupons;