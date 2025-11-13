import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import toast from "react-hot-toast";
import { useState } from "react";
import { user as userImg } from "../../assets/index.js";
import { Camera, BookOpen, School, GraduationCap, FileText } from "lucide-react";
import useRefreshToken from "../../hooks/useRefreshToken.jsx";
import { useNavigate } from "react-router";

function TutorForm({ tutor }) {
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            fullName: tutor?.fullName || '',
            email: tutor?.email || '',
            phone: tutor?.phone || '',
            school: tutor?.school || '',
            classes: tutor?.classes ? tutor.classes.join(', ') : '', // Convert array to string
            grades: tutor?.grades || '',
            image: tutor?.image || '',
            description: tutor?.description || '',
            isVerified: tutor?.isVerified || false,
            isActive: tutor?.isActive || true
        }
    });

    const dispatch = useDispatch();

    const handleAddTutor = async (tutorData) => {
        try {
            setIsAdding(true);
            const formData = new FormData();
            formData.append('fullName', tutorData.fullName);
            formData.append('email', tutorData.email);
            formData.append('phone', tutorData.phone);
            formData.append('school', tutorData.school);
            formData.append('grades', tutorData.grades);
            formData.append('description', tutorData.description);
            formData.append('isVerified', tutorData.isVerified);
            formData.append('isActive', tutorData.isActive);
            formData.append('password', 'tempPassword123'); // Required field

            // Process classes from comma-separated string to array and send as JSON string
            const classesArray = tutorData.classes.split(',')
                .map(cls => cls.trim())
                .filter(cls => cls.length > 0);

            // Send as JSON string instead of multiple form fields
            formData.append('classes', JSON.stringify(classesArray));

            if (tutorData.image[0] instanceof File) {
                formData.append('image', tutorData.image[0]);
            } else if (tutorData.image) {
                formData.append('image', tutorData.image);
            }

            const { data } = await axios.post(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/register`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (data && data.success) {
                toast.success(data.message);
                setIsAdding(false);
                navigate('/admin/lsat-tutoring');
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const formData = new FormData();
                    formData.append('fullName', tutorData.fullName);
                    formData.append('email', tutorData.email);
                    formData.append('phone', tutorData.phone);
                    formData.append('school', tutorData.school);
                    formData.append('grades', tutorData.grades);
                    formData.append('description', tutorData.description);
                    formData.append('isVerified', tutorData.isVerified);
                    formData.append('isActive', tutorData.isActive);
                    formData.append('password', 'tempPassword123');

                    const classesArray = tutorData.classes.split(',')
                        .map(cls => cls.trim())
                        .filter(cls => cls.length > 0);

                    // Send as JSON string instead of multiple form fields
                    formData.append('classes', JSON.stringify(classesArray));

                    if (tutorData.image[0] instanceof File) {
                        formData.append('image', tutorData.image[0]);
                    }

                    const { data } = await axios.post(
                        `${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/register`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setIsAdding(false);
                        navigate('/admin/lsat-tutoring');
                    }
                } catch (error) {
                    console.error(error);
                    toast.error(error?.response?.data?.message || 'Failed to add tutor');
                    setIsAdding(false);
                }
            } else {
                setIsAdding(false);
                toast.error(message || 'Failed to add tutor');
            }
        }
    }

    const handleUpdateTutor = async (tutorData) => {
        try {
            setIsAdding(true);
            const formData = new FormData();
            formData.append('fullName', tutorData.fullName);
            formData.append('email', tutorData.email);
            formData.append('phone', tutorData.phone);
            formData.append('school', tutorData.school);
            formData.append('grades', tutorData.grades);
            formData.append('description', tutorData.description);
            formData.append('isVerified', tutorData.isVerified);
            formData.append('isActive', tutorData.isActive);

            // Process classes from comma-separated string to array and send as JSON string
            const classesArray = tutorData.classes.split(',')
                .map(cls => cls.trim())
                .filter(cls => cls.length > 0);

            formData.append('classes', JSON.stringify(classesArray));

            if (tutorData.image[0] instanceof File) {
                formData.append('image', tutorData.image[0]);
            } else if (tutorData.image) {
                formData.append('image', tutorData.image);
            }

            const { data } = await axios.patch(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/update/${tutor._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (data && data.success) {
                toast.success(data.message);
                setIsAdding(false);
                navigate('/admin/lsat-tutoring');
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const formData = new FormData();
                    formData.append('fullName', tutorData.fullName);
                    formData.append('email', tutorData.email);
                    formData.append('phone', tutorData.phone);
                    formData.append('school', tutorData.school);
                    formData.append('grades', tutorData.grades);
                    formData.append('description', tutorData.description);
                    formData.append('isVerified', tutorData.isVerified);
                    formData.append('isActive', tutorData.isActive);

                    const classesArray = tutorData.classes.split(',')
                        .map(cls => cls.trim())
                        .filter(cls => cls.length > 0);

                    formData.append('classes', JSON.stringify(classesArray));

                    if (tutorData.image[0] instanceof File) {
                        formData.append('image', tutorData.image[0]);
                    }

                    const { data } = await axios.patch(
                        `${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/update/${tutor._id}`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setIsAdding(false);
                        navigate('/admin/lsat-tutoring');
                    }
                } catch (error) {
                    console.error(error);
                    toast.error(error?.response?.data?.message || 'Failed to update tutor');
                    setIsAdding(false);
                }
            } else {
                setIsAdding(false);
                toast.error(message || 'Failed to update tutor');
            }
        }
    }

    const image = watch('image');

    return (
        <div className="flex gap-4 mt-14">
            <div className="w-full lg:w-4/5 xl:w-2xl shadow-[5px_5px_20px_rgba(219,234,254,1),-5px_-5px_20px_rgba(219,234,254,1)] p-10 rounded-xl h-fit relative">
                <div>
                    <form onSubmit={tutor ? handleSubmit(handleUpdateTutor) : handleSubmit(handleAddTutor)} encType="multipart/form-data">
                        {/* Profile Image */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full overflow-hidden h-24 w-24 border-2 border-blue-200">
                            <label className="w-full h-full relative group">
                                <input type="file" {...register('image')} hidden />

                                <img
                                    src={image?.[0] instanceof File ? URL.createObjectURL(image[0]) : tutor?.image ? tutor.image : userImg}
                                    loading="lazy"
                                    alt="tutor image"
                                    className="w-full h-full object-cover cursor-pointer peer"
                                />

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-gray-800/40 group-hover:flex items-center justify-center hidden cursor-pointer">
                                    <div>
                                        <Camera className="text-white" />
                                    </div>
                                </div>
                            </label>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mt-16">
                            {/* Personal Information */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700" htmlFor="fullName">Full Name:</label>
                                <input
                                    className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full"
                                    id="fullName"
                                    type="text"
                                    {...register('fullName', { required: true })}
                                    placeholder="Enter full name here..."
                                />
                                {errors.fullName && <span className="text-red-500 text-sm">Full name is required</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700" htmlFor="email">Email:</label>
                                <input
                                    className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full"
                                    id="email"
                                    type="email"
                                    {...register('email', { required: true })}
                                    placeholder="Enter email here..."
                                />
                                {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700" htmlFor="phone">Phone:</label>
                                <input
                                    className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full"
                                    id="phone"
                                    type="tel"
                                    {...register('phone', { required: true })}
                                    placeholder="Enter phone number here..."
                                />
                                {errors.phone && <span className="text-red-500 text-sm">Phone is required</span>}
                            </div>

                            {/* Academic Information */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700 flex items-center gap-1" htmlFor="school">
                                    <School size={16} />
                                    <span>School:</span>
                                </label>
                                <input
                                    className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full"
                                    id="school"
                                    type="text"
                                    {...register('school', { required: true })}
                                    placeholder="Enter school name here..."
                                />
                                {errors.school && <span className="text-red-500 text-sm">School is required</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700 flex items-center gap-1" htmlFor="classes">
                                    <BookOpen size={16} />
                                    <span>Classes (comma separated):</span>
                                </label>
                                <input
                                    className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full"
                                    id="classes"
                                    type="text"
                                    {...register('classes', { required: true })}
                                    placeholder="e.g., LSAT"
                                />
                                {errors.classes && <span className="text-red-500 text-sm">Classes are required</span>}
                                <p className="text-xs text-gray-500">Separate multiple classes with commas</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700 flex items-center gap-1" htmlFor="grades">
                                    <GraduationCap size={16} />
                                    <span>Grades/Score:</span>
                                </label>
                                <input
                                    className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full"
                                    id="grades"
                                    type="text"
                                    {...register('grades', { required: true })}
                                    placeholder="e.g., 175 LSAT Score, A+ Grade"
                                />
                                {errors.grades && <span className="text-red-500 text-sm">Grades are required</span>}
                            </div>

                            {/* Status Fields */}
                            {tutor && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isVerified"
                                            {...register('isVerified')}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="isVerified" className="text-gray-700">Verified Tutor</label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            {...register('isActive')}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="isActive" className="text-gray-700">Active Account</label>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Description - Full Width */}
                        <div className="mt-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700 flex items-center gap-1" htmlFor="description">
                                    <FileText size={16} />
                                    <span>Description:</span>
                                </label>
                                <textarea
                                    className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full min-h-[100px] resize-vertical"
                                    id="description"
                                    {...register('description', { required: true })}
                                    placeholder="Enter a description about the tutor..."
                                />
                                {errors.description && <span className="text-red-500 text-sm">Description is required</span>}
                            </div>
                        </div>

                        <div className="w-full rounded bg-blue-600 mt-6 text-white">
                            <button
                                className="w-full p-3 cursor-pointer flex gap-1 items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
                                type="submit"
                                disabled={isAdding}
                            >
                                {
                                    !isAdding ?
                                        (tutor ? 'Update Tutor' : 'Add Tutor') :
                                        (<span className="flex space-x-1 items-center justify-center py-2">
                                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                                        </span>)
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TutorForm;