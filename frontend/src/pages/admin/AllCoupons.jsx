import { useEffect } from "react";
import { AdminContainer, AdminSidebar, LoadingSpinner, UserPopUp } from "../../components";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Check, FileDownIcon, Plus } from "lucide-react";
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

                if (data.success) {
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

    const handleStatusUpdate = async (id) => {
        try {
            const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/status/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                setAllCoupons(coupons => {
                    return coupons.map(coupon => {
                        if (coupon._id === id) {
                            return { ...coupon, status: data.data.status }
                        }
                        return coupon;
                    })
                })
                toast.success(data.message);
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/status/${id}`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        setAllCoupons(coupons => {
                            return coupons.map(coupon => {
                                if (coupon._id === id) {
                                    return { ...coupon, status: data.data.status }
                                }
                                return coupon;
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
                                                                {coupon.service.title}
                                                            </p>

                                                            <p>
                                                                {coupon.fullName}
                                                            </p>

                                                            <p>{new Date(coupon.dateTime).toDateString() + " " + `(${new Date(coupon.dateTime).toLocaleTimeString()})`}</p>

                                                            <p className={`flex items-center gap-1 ${coupon.payment ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${!coupon.payment && 'bg-red-600'} rounded-full`}></span> <span>{coupon.payment ? `$${coupon.service.price}` : 'Pending'}</span></p>

                                                            <div>
                                                                {
                                                                    coupon.document.map((doc) => {
                                                                        return (
                                                                            <Link key={doc} target="_blank" to={`${doc}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">{cleanFileName(decodeURIComponent(doc))}</span></Link>
                                                                        )
                                                                    })
                                                                }
                                                            </div>

                                                            <p className={`flex items-center gap-1 ${coupon.status ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${coupon.status ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{coupon.status ? 'Done' : 'Pending'}</span></p>

                                                            {
                                                                !coupon.status
                                                                &&
                                                                <button onClick={() => handleStatusUpdate(coupon._id)} className="bg-green-600 py-2 px-5 rounded text-white cursor-pointer flex items-center gap-1 max-w-max"><Check size={20} /> <span>Done</span></button>
                                                            }

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
                                                                    {coupon.service.title}
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Usage Limit:</p>
                                                                <p>
                                                                    {coupon.fullName}
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Redeemed:</p>
                                                                <p>{new Date(coupon.dateTime).toDateString() + " " + `(${new Date(coupon.dateTime).toLocaleTimeString()})`}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Expiration:</p>
                                                                <p>${coupon.service.price}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Discount (%):</p>
                                                                <div>
                                                                    {
                                                                        coupon.document.map((doc) => {
                                                                            return (
                                                                                <Link key={doc} target="_blank" to={`${doc}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">{cleanFileName(decodeURIComponent(doc))}</span></Link>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Status:</p>
                                                                <p className={`flex items-center gap-1 ${coupon.status ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${coupon.status ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{coupon.status ? 'Done' : 'Pending'}</span></p>
                                                            </div>

                                                            {
                                                                !coupon.status
                                                                &&
                                                                <button onClick={() => handleStatusUpdate(coupon._id)} className="bg-green-600 py-2 px-5 rounded text-white cursor-pointer flex items-center gap-1 max-w-max"><Check size={20} /> <span>Done</span></button>
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

export default AllCoupons;