import { useEffect } from "react";
import { AdminContainer, AdminSidebar, LoadingSpinner, UserPopUp } from "../../components/index.js";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Check, Edit, FileDownIcon, HelpCircle } from "lucide-react";
import { Link } from "react-router";
import useRefreshToken from "../../hooks/useRefreshToken.jsx";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import cleanFileName from "../../hooks/CleanFileName.jsx";
import { useForm } from "react-hook-form";

function AllAccommodations() {
    const [showPricePopUp, setShowPricePopUp] = useState(false);
    const user = useSelector(state => state.user.user);
    const [allAccommodations, setAllAccommodations] = useState(null);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();
    const [userPopUpEmail, setUserPopUpEmail] = useState(null);
    const [accommodationPrice, setAccommodationPrice] = useState(null);

    useEffect(() => {
        const getAllAccommodations = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/accommodations/all`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

                if (data.success) {
                    setAllAccommodations(data.data);
                }
            } catch (error) {
                const message = error?.response?.data?.message;
                if (message === 'accessToken') {
                    try {
                        const newAccessToken = await refreshAccessToken();

                        const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/accommodations/all`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                        if (data && data.success) {
                            dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                            setAllAccommodations(data.data);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
        getAllAccommodations();
    }, [])

    useEffect(() => {
        const getAllOthers = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/all`);
                if (data && data.success) {
                    setAccommodationPrice(data.data[0].accommodationPrice);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getAllOthers();
    }, [])

    const handleStatusUpdate = async (id) => {
        try {
            const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/accommodations/status/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                setAllAccommodations(accommodations => {
                    return accommodations.map(accommodation => {
                        if (accommodation._id === id) {
                            return { ...accommodation, status: data.data.status }
                        }
                        return accommodation;
                    })
                })
                toast.success(data.message);
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/accommodations/status/${id}`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        setAllAccommodations(accommodations => {
                            return accommodations.map(accommodation => {
                                if (accommodation._id === id) {
                                    return { ...accommodation, status: data.data.status }
                                }
                                return accommodation;
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

    const handleShowPricePopUp = (email) => {
        setUserPopUpEmail(email);
        setShowPricePopUp(true);
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            accommodationPrice: accommodationPrice || '',
        }
    });

    const accommodationFormHandler = async (accommodationData) => {
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/update/accommodation-price`, { price: accommodationData.accommodationPrice }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                setAccommodationPrice(data.data.accommodationPrice);
                setShowPricePopUp(false)
                toast.success(data.message);
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();
                    const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/update/accommodation-price`, { price: accommodationData.accommodationPrice }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        setAccommodationPrice(data.data.accommodationPrice);
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
    
    return (
        <section className="flex min-h-[90vh]">
            {
                showPricePopUp &&
                <section className="top-0 left-0 right-0 bottom-0 bg-black/70 z-50 flex items-center justify-center fixed">
                    <div className="flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-300">
                        <div className="flex items-center justify-center p-4 bg-blue-100 rounded-full">
                            <Edit className="text-blue-600" />
                        </div>

                        <h2 className="text-gray-900 font-semibold mt-4 text-xl">Update Price</h2>
                        <form onSubmit={handleSubmit(accommodationFormHandler)} className="mt-3">
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700" htmlFor="accommodationPrice">Price:</label>
                                <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="accommodationPrice" type="number" {...register('accommodationPrice', { required: true })} placeholder="Enter accommodation price here..." />
                                {errors.accommodationPrice && <p className="text-sm text-orange-500 font-light">Price is required.</p>}
                            </div>

                            <div className="flex items-center justify-center gap-4 mt-5 w-full">
                                <button type="button" className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition cursor-pointer" onClick={() => setShowPricePopUp(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="w-full md:w-36 h-10 rounded-md text-white bg-blue-600 font-medium text-sm hover:bg-blue-700 active:scale-95 transition cursor-pointer">
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            }

            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full relative">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Sessions - Accommodations</h2>
                    <p className="text-gray-600">Track and manage every scheduled session or consultation for accommodations in one place. Stay informed and ensure seamless communication between users and experts.</p>

                    <br />

                    <button onClick={() => setShowPricePopUp(true)} className="bg-blue-600 py-3 px-6 rounded-md text-white cursor-pointer sm:absolute sm:right-0 sm:top-0 flex items-center gap-1 justify-start max-w-max" to="/admin/blogs/add"><Edit size={18} strokeWidth={3} /><span>Edit Price</span></button>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Sessions - Accommodations</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">User</h5>
                                <h5 className="text-lg">Exam/Program</h5>
                                <h5 className="text-lg">Exam/Test Date</h5>
                                <h5 className="text-lg">Documentation</h5>
                                <h5 className="text-lg">Payment</h5>
                                <h5 className="text-lg">Document</h5>
                                <h5 className="text-lg">Status</h5>
                                <h5 className="text-lg">Action</h5>
                            </div>

                            {
                                allAccommodations
                                    ?
                                    (
                                        <>
                                            <div className="hidden sm:block">
                                                {
                                                    allAccommodations.map(accommodation => (
                                                        <div key={accommodation._id} className="md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">

                                                            <p className="text-blue-600 underline">
                                                                <Link to={`mailto:${accommodation.email}`}>{accommodation.fullName}</Link>
                                                            </p>

                                                            <div>
                                                                {
                                                                    accommodation.exam && accommodation.exam.length > 0
                                                                        ?
                                                                        accommodation.exam.map((ex) => {
                                                                            return (
                                                                                <p key={ex}>{ex}</p>
                                                                            )
                                                                        })
                                                                        :
                                                                        <p>Not Specified</p>
                                                                }
                                                            </div>

                                                            <p className="">
                                                                {new Date(accommodation.dateTime).toDateString() || 'Not Specified'}
                                                            </p>

                                                            <p className="">
                                                                {accommodation.supportingDocumentation || 'Not Specified'}
                                                            </p>

                                                            <p className={`flex items-center gap-1 ${accommodation.payment ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${!accommodation.payment && 'bg-red-600'} rounded-full`}></span> <span>{accommodation.payment ? `$${accommodation.price}` : 'Pending'}</span></p>

                                                            <div>
                                                                {
                                                                    accommodation.document.map((doc) => {
                                                                        return (
                                                                            <Link key={doc} target="_blank" to={`${doc}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">{cleanFileName(decodeURIComponent(doc))}</span></Link>
                                                                        )
                                                                    })
                                                                }
                                                            </div>

                                                            <p className={`flex items-center gap-1 ${accommodation.status ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${accommodation.status ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{accommodation.status ? 'Done' : 'Pending'}</span></p>

                                                            {
                                                                !accommodation.status
                                                                &&
                                                                <button onClick={() => handleStatusUpdate(accommodation._id)} className="bg-green-600 py-2 px-5 rounded text-white cursor-pointer flex items-center gap-1 max-w-max"><Check size={20} /> <span>Done</span></button>
                                                            }

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className="sm:hidden">
                                                {
                                                    allAccommodations.map(accommodation => (
                                                        <div key={accommodation._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">User:</p>
                                                                <p className="text-blue-600 underline">
                                                                    <Link to={`mailto:${accommodation.email}`}>{accommodation.fullName}</Link>
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Exam/Program:</p>
                                                                <div>
                                                                    {
                                                                        accommodation.exam && accommodation.exam.length > 0
                                                                            ?
                                                                            accommodation.exam.map((ex) => {
                                                                                return (
                                                                                    <p key={ex}>{ex}</p>
                                                                                )
                                                                            })
                                                                            :
                                                                            <p>Not Included</p>
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Exam/Test Date:</p>
                                                                <p>{new Date(accommodation.dateTime).toDateString()}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Documentation:</p>
                                                                <p>{accommodation.supportingDocumentation || 'Not Specified'}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Payment:</p>
                                                                <p className={`flex items-center gap-1 ${accommodation.payment ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${!accommodation.payment && 'bg-red-600'} rounded-full`}></span> <span>{accommodation.payment ? `$${accommodation.price}` : 'Pending'}</span></p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Doc(s):</p>
                                                                <div>
                                                                    {
                                                                        accommodation.document.map((doc) => {
                                                                            return (
                                                                                <Link key={doc} target="_blank" to={`${doc}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">{cleanFileName(decodeURIComponent(doc))}</span></Link>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Status:</p>
                                                                <p className={`flex items-center gap-1 ${accommodation.status ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${accommodation.status ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{accommodation.status ? 'Done' : 'Pending'}</span></p>
                                                            </div>

                                                            {
                                                                !accommodation.status
                                                                &&
                                                                <button onClick={() => handleStatusUpdate(accommodation._id)} className="bg-green-600 py-2 px-5 rounded text-white cursor-pointer flex items-center gap-1 max-w-max"><Check size={20} /> <span>Done</span></button>
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

export default AllAccommodations;