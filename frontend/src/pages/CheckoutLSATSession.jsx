import { CalendarDays, Clock, File, LockKeyholeIcon, Mail, Phone, User, UserCheck2, BookOpen, Target, GraduationCap, Users, UserCircle } from "lucide-react";
import { Container, FileInput, LSATPackagesModal } from "../components";
import { Link, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import useRefreshToken from "../hooks/useRefreshToken";
import { updateUser } from "../features/forms/UserAuthSlice.js";
import toast from "react-hot-toast";

function CheckoutLSATSession() {
    const formRef = useRef();
    const [isBooking, setIsBooking] = useState(false);
    const user = useSelector(state => state.user.user);
    const [isChecked, setIsChecked] = useState(false);
    const [termsWarning, setTermsWarning] = useState(false);
    const [userPackages, setUserPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState('');
    const { search } = useLocation();
    const urlParams = new URLSearchParams(search);
    const sessionType = urlParams.get('type');
    const studentsFromUrl = urlParams.get('students');

    // Set initial number of students from URL or default to 2
    const [numberOfStudents, setNumberOfStudents] = useState(
        studentsFromUrl && sessionType === 'class' ? parseInt(studentsFromUrl) : 2
    );
    const [tutors, setTutors] = useState([]);
    const [selectedTutor, setSelectedTutor] = useState('');
    const [loadingTutors, setLoadingTutors] = useState(true);
    const [pricing, setPricing] = useState(null);
    const [loadingPricing, setLoadingPricing] = useState(true);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            currentScore: '',
            targetScore: '',
            weakAreas: '',
            studyMaterials: '',
            previousTutoring: '',
            specificGoals: '',
            dateTime: '',
            notes: '',
            document: '',
            sessionType: sessionType || '',
            numberOfStudents: 2,
            tutor: ''
        }
    });

    const email = watch('email');

    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();
    const [isPackagesModalOpen, setIsPackagesModalOpen] = useState(false);

    // Fetch all tutors
    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/all`);
                if (data && data.success) {
                    // Filter active and verified tutors
                    const activeTutors = data.data.filter(tutor => tutor.isActive && tutor.isVerified);
                    setTutors(activeTutors);

                    // Auto-select first tutor if available
                    if (activeTutors.length > 0 && !selectedTutor) {
                        setSelectedTutor('691808b0f8541dd55cc4a080');
                        setValue('tutor', '691808b0f8541dd55cc4a080');
                    }
                }
            } catch (error) {
                console.error('Error fetching tutors:', error);
                toast.error('Failed to load tutors');
            } finally {
                setLoadingTutors(false);
            }
        };
        fetchTutors();
    }, [setValue, selectedTutor]);

    // Fetch user's active packages
    useEffect(() => {
        const fetchUserPackages = async () => {
            if ((user?.email || email) && sessionType === 'one-on-one') {
                try {
                    const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/user/${user.email || email}`);
                    if (data && data.success) {
                        setUserPackages(data.data);

                        // Auto-select first package if available
                        if (data.data.length > 0 && !selectedPackage) {
                            setSelectedPackage(data.data[0]._id);
                        }
                    } else {
                        setUserPackages([]);
                    }
                } catch (error) {
                    console.error('Error fetching user packages:', error);
                    setUserPackages([]);
                }
            }
        };
        fetchUserPackages();
    }, [user, sessionType, selectedPackage, email]);

    // Fetch pricing
    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/pricing`);
                if (data && data.success) {
                    setPricing(data.data);
                }
            } catch (error) {
                console.error('Error fetching pricing:', error);
                // Fallback to default pricing
                const defaultPricing = {
                    2: { perPerson: 70, total: 140 },
                    3: { perPerson: 65, total: 195 },
                    4: { perPerson: 60, total: 240 },
                    5: { perPerson: 55, total: 275 }
                };
                setPricing(defaultPricing);
            } finally {
                setLoadingPricing(false);
            }
        };
        fetchPricing();
    }, []);

    useEffect(() => {
        if (sessionType === 'class' && studentsFromUrl) {
            const students = parseInt(studentsFromUrl);
            if (students >= 2 && students <= 5) {
                setNumberOfStudents(students);
            }
        }
    }, [sessionType, studentsFromUrl]);

    // Calculate pricing based on number of students
    const calculatePricing = (students) => {
        if (!pricing) {
            // Fallback while loading
            const defaultPricing = {
                2: { perPerson: 70, total: 140 },
                3: { perPerson: 65, total: 195 },
                4: { perPerson: 60, total: 240 },
                5: { perPerson: 55, total: 275 }
            };
            return defaultPricing[students] || defaultPricing[2];
        }
        return pricing[students] || pricing[2];
    };

    const currentPricing = !loadingPricing ? calculatePricing(numberOfStudents) : { perPerson: 0, total: 0 };

    const checkoutHandler = async (userData) => {
        try {
            if (!isChecked) {
                setTermsWarning(true);
                return;
            }

            // Validate tutor selection
            if (!selectedTutor) {
                toast.error('Please select a tutor for your session');
                return;
            }

            // Validate number of students for class sessions
            if (sessionType === 'class' && (!numberOfStudents || numberOfStudents < 2 || numberOfStudents > 5)) {
                toast.error('Please select a valid number of students (2-5)');
                return;
            }

            // For 1-on-1 sessions, validate package availability
            if (sessionType === 'one-on-one') {
                if (!selectedPackage) {
                    toast.error('Please select a package for your 1-on-1 session');
                    return;
                }

                // Check if selected package is still valid
                const selectedPkg = userPackages.find(pkg => pkg._id === selectedPackage);
                if (!selectedPkg || selectedPkg.sessionsRemaining <= 0) {
                    toast.error('Selected package has no remaining sessions. Please select another package.');
                    return;
                }
            }

            setIsBooking(true);
            const formData = new FormData();

            // Basic customer info
            formData.append('fullName', userData.fullName);
            formData.append('email', userData.email);
            formData.append('phone', userData.phone);
            formData.append('tutor', selectedTutor);

            // Session details
            formData.append('sessionType', sessionType);
            formData.append('packageId', selectedPackage);
            formData.append('currentScore', userData.currentScore);
            formData.append('targetScore', userData.targetScore);
            formData.append('weakAreas', userData.weakAreas);
            formData.append('studyMaterials', userData.studyMaterials);
            formData.append('previousTutoring', userData.previousTutoring);
            formData.append('specificGoals', userData.specificGoals);
            formData.append('dateTime', userData.dateTime);
            formData.append('notes', userData.notes);
            formData.append('numberOfStudents', sessionType === 'class' ? numberOfStudents : 1);

            // Set price based on session type
            if (sessionType === 'free') {
                formData.append('price', 0);
            } else if (sessionType === 'class') {
                formData.append('price', currentPricing.total);
                formData.append('pricePerPerson', currentPricing.perPerson);
            } else {
                formData.append('price', 0); // 1-on-1 uses package sessions
            }

            // Documents
            if (userData.document) {
                Object.values(userData.document).forEach((file) => {
                    formData.append('document', file);
                });
            }

            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-sessions/create`, formData);

            if (data && data.success) {
                toast.success(data.message);
                const sessionId = data.data._id;

                // For free sessions, no payment needed
                if (sessionType === 'free') {
                    toast.success('Your free consultation session has been booked!');
                    // Redirect to success page
                    window.location.href = `/checkout-lsat-session-success/${sessionId}`;
                } else if (sessionType === 'class') {
                    // For class sessions, proceed to payment
                    try {
                        const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/create-checkout-lsat-session`, {
                            sessionId: sessionId,
                            numberOfStudents: numberOfStudents,
                            totalAmount: currentPricing.total
                        });

                        if (data) {
                            window.location.href = data.url;
                        }
                    } catch (error) {
                        const message = error?.response?.data?.message;
                        toast.error(message);
                        setIsBooking(false);
                    }
                } else {
                    // For 1-on-1 sessions, redirect to success
                    window.location.href = `/checkout-lsat-session-success/${sessionId}`;
                }
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const formData = new FormData();
                    // Repeat form data creation...
                    formData.append('fullName', userData.fullName);
                    formData.append('email', userData.email);
                    formData.append('phone', userData.phone);
                    formData.append('tutor', selectedTutor);
                    formData.append('sessionType', sessionType);
                    formData.append('packageId', selectedPackage);
                    formData.append('currentScore', userData.currentScore);
                    formData.append('targetScore', userData.targetScore);
                    formData.append('weakAreas', userData.weakAreas);
                    formData.append('studyMaterials', userData.studyMaterials);
                    formData.append('previousTutoring', userData.previousTutoring);
                    formData.append('specificGoals', userData.specificGoals);
                    formData.append('dateTime', userData.dateTime);
                    formData.append('notes', userData.notes);
                    formData.append('numberOfStudents', sessionType === 'class' ? numberOfStudents : 1);

                    if (sessionType === 'free') {
                        formData.append('price', 0);
                    } else if (sessionType === 'class') {
                        formData.append('price', currentPricing.total);
                        formData.append('pricePerPerson', currentPricing.perPerson);
                    } else {
                        formData.append('price', 0);
                    }

                    if (userData.document) {
                        Object.values(userData.document).forEach((file) => {
                            formData.append('document', file);
                        });
                    }

                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-sessions/create`, formData);

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        const sessionId = data.data._id;

                        if (sessionType === 'free') {
                            toast.success('Your free consultation session has been booked!');
                            window.location.href = `/checkout-lsat-session-success/${sessionId}`;
                        } else if (sessionType === 'class') {
                            try {
                                const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/create-checkout-lsat-session`, {
                                    sessionId: sessionId,
                                    numberOfStudents: numberOfStudents,
                                    totalAmount: currentPricing.total
                                });

                                if (data) {
                                    window.location.href = data.url;
                                }
                            } catch (error) {
                                const message = error?.response?.data?.message;
                                toast.error(message);
                                setIsBooking(false);
                            }
                        } else {
                            window.location.href = `/checkout-lsat-session-success/${sessionId}`;
                        }
                    }
                } catch (error) {
                    const message = error?.response?.data?.message;
                    toast.error(message);
                    setIsBooking(false);
                }
            } else {
                toast.error(message || 'Failed to book session');
                console.log(error);
                setIsBooking(false);
            }
        }
    }

    const getSelectedTutor = () => {
        return tutors.find(tutor => tutor._id === selectedTutor);
    };

    return (
        <section className="min-h-[70vh] pt-24 md:pt-32 relative">
            {/* Modal */}
            <LSATPackagesModal
                isOpen={isPackagesModalOpen}
                onClose={() => setIsPackagesModalOpen(false)}
            />

            <Container className="grid md:grid-cols-2 gap-5 lg:gap-14 xl:gap-20 divide-blue-100">
                {/* Customer Information */}
                <section>
                    <h2 className="text-3xl font-bold text-blue-950">Book LSAT Tutoring Session</h2>

                    <div className="my-8">
                        <h5 className="font-semibold text-blue-950">Student Information</h5>
                        <form ref={formRef} onSubmit={handleSubmit(checkoutHandler)} className="border border-blue-100 p-5 rounded-md my-5 shadow-lg shadow-blue-100">
                            <div className="grid md:grid-cols-2 md:gap-3">
                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='fullNameCheckout'><User size={18} /> <span>Full Name *</span></label>
                                    <input id="fullNameCheckout" type="text" placeholder="e.g. Alan Parker" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('fullName', { required: true })} />
                                    {errors.fullName && <p className="text-sm text-orange-500 font-light">Full name is required</p>}
                                </div>

                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='emailCheckout'><Mail size={18} /> <span>E-Mail *</span></label>
                                    <input id="emailCheckout" type="email" placeholder="name@example.com" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('email', { required: true })} />
                                    {errors.email && <p className="text-sm text-orange-500 font-light">Email is required</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 md:gap-3 items-start">
                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='phoneCheckout'>
                                        <Phone size={18} /> <span>Phone *</span>
                                    </label>
                                    <input
                                        id="phoneCheckout"
                                        type="tel"
                                        placeholder="(+1) 917-XXX-XXXX"
                                        className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9+\s()\-]/g, '');
                                        }}
                                        {...register('phone', {
                                            required: true,
                                            pattern: {
                                                value: /^[0-9+\s()\-]+$/,
                                                message: "Please enter a valid phone number (numbers, +, -, () only)"
                                            }
                                        })}
                                    />
                                    {errors.phone?.type === 'required' && (
                                        <p className="text-sm text-orange-500 font-light">Phone is required</p>
                                    )}
                                    {errors.phone?.type === 'pattern' && (
                                        <p className="text-sm text-orange-500 font-light">{errors.phone.message}</p>
                                    )}
                                </div>

                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='dateTime'><CalendarDays size={18} /> <span>Preferred Date & Time *</span></label>
                                    <input id="dateTime" type="datetime-local" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('dateTime', { required: true })} />
                                    {errors.dateTime && <p className="text-sm text-orange-500 font-light">Please select a date and time for your session</p>}
                                </div>
                            </div>

                            {/* Tutor Selection */}
                            <div className="my-6">
                                <p className="font-bold text-blue-950 mb-3 flex items-center gap-2">
                                    <UserCircle size={18} />
                                    Select Your Tutor *
                                </p>
                                {loadingTutors ? (
                                    <div className="text-gray-600">Loading tutors...</div>
                                ) : (
                                    <select
                                        className="w-full border-2 border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200"
                                        value={selectedTutor}
                                        onChange={(e) => {
                                            setSelectedTutor(e.target.value);
                                            setValue('tutor', e.target.value);
                                        }}
                                        required
                                    >
                                        <option value="">Choose a tutor...</option>
                                        {tutors.map((tutor) => (
                                            <option key={tutor._id} value={tutor._id}>
                                                {tutor.fullName} - {tutor.school}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {selectedTutor && getSelectedTutor() && (
                                    <div className="mt-2 flex items-center gap-3 p-3 bg-blue-50 rounded-md">
                                        {getSelectedTutor().image && (
                                            <img
                                                src={getSelectedTutor().image}
                                                alt={getSelectedTutor().fullName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="font-semibold text-blue-900">{getSelectedTutor().fullName}</p>
                                            <p className="text-sm text-gray-600">{getSelectedTutor().school}</p>
                                            <p className="text-sm text-gray-500">{getSelectedTutor().description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Number of Students Selection for Class Sessions */}
                            {sessionType === 'class' && (
                                <div className="my-6">
                                    <p className="font-bold text-blue-950 mb-3 flex items-center gap-2">
                                        <Users size={18} />
                                        Group Size
                                    </p>
                                    <select
                                        className="w-full border-2 border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200"
                                        value={numberOfStudents}
                                        onChange={(e) => setNumberOfStudents(parseInt(e.target.value))}
                                        required
                                        disabled={loadingPricing}
                                    >
                                        <option value={2}>
                                            {loadingPricing ? 'Loading...' : `2 Students - $${calculatePricing(2).perPerson} per person`}
                                        </option>
                                        <option value={3}>
                                            {loadingPricing ? 'Loading...' : `3 Students - $${calculatePricing(3).perPerson} per person`}
                                        </option>
                                        <option value={4}>
                                            {loadingPricing ? 'Loading...' : `4 Students - $${calculatePricing(4).perPerson} per person`}
                                        </option>
                                        <option value={5}>
                                            {loadingPricing ? 'Loading...' : `5 Students - $${calculatePricing(5).perPerson} per person`}
                                        </option>
                                    </select>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {loadingPricing ? 'Loading pricing...' : `Total amount: $${currentPricing.total} ($${currentPricing.perPerson} per person)`}
                                    </p>
                                </div>
                            )}

                            {/* Package Selection for 1-on-1 Sessions */}
                            {sessionType === 'one-on-one' && (
                                <div className="my-6">
                                    <p className="font-bold text-blue-950 mb-3 flex items-center gap-2">
                                        <GraduationCap size={18} />
                                        Select Your Package *
                                    </p>
                                    {userPackages.length > 0 ? (
                                        <select
                                            className="w-full border-2 border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200"
                                            value={selectedPackage}
                                            onChange={(e) => setSelectedPackage(e.target.value)}
                                            required
                                        >
                                            <option value="">Select a package...</option>
                                            {userPackages.map((pkg) => (
                                                <option key={pkg._id} value={pkg._id}>
                                                    {pkg.package?.title} ({pkg.sessionsRemaining} sessions remaining)
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                                            <p className="text-orange-800 font-semibold">No Active Packages Found</p>
                                            <p className="text-orange-700 text-sm mt-1">
                                                You need to purchase an LSAT package before booking 1-on-1 sessions.
                                            </p>
                                            <button
                                                onClick={() => setIsPackagesModalOpen(true)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block cursor-pointer hover:underline"
                                            >
                                                View Packages →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Rest of the form remains the same */}
                            <p className="font-bold text-blue-950 my-4 flex items-center gap-2">
                                <Target size={18} />
                                LSAT Background & Goals
                            </p>

                            <div className="grid md:grid-cols-2 md:gap-3">
                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='currentScore'>
                                        <span>Current LSAT Score (if known)</span>
                                    </label>
                                    <input id="currentScore" type="text" placeholder="e.g., 155, Not taken yet" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('currentScore', { required: false })} />
                                </div>

                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='targetScore'>
                                        <span>Target LSAT Score *</span>
                                    </label>
                                    <input id="targetScore" type="text" placeholder="e.g., 170" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('targetScore', { required: true })} />
                                    {errors.targetScore && <p className="text-sm text-orange-500 font-light">Target score is required</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 my-2 md:my-3 gap-2">
                                <label htmlFor="weakAreas" className="flex items-center gap-1">
                                    <span>Which LSAT sections are most challenging for you? *</span>
                                </label>
                                <textarea id="weakAreas" placeholder="e.g., Logical Reasoning, Reading Comprehension, Logic Games, Time Management..." className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" rows={3} {...register('weakAreas', { required: true })}></textarea>
                                {errors.weakAreas && <p className="text-sm text-orange-500 font-light">Please let us know which areas you need help with</p>}
                            </div>

                            <div className="grid grid-cols-1 my-2 md:my-3 gap-2">
                                <label htmlFor="studyMaterials" className="flex items-center gap-1">
                                    <span>What study materials are you currently using?</span>
                                </label>
                                <textarea id="studyMaterials" placeholder="e.g., Khan Academy, LSAT prep books, online courses..." className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" rows={2} {...register('studyMaterials', { required: false })}></textarea>
                            </div>

                            <div>
                                <p className="flex items-center gap-1">
                                    <span>Have you had LSAT tutoring before? *</span>
                                </p>
                                <div className="my-2">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" value="Yes" {...register('previousTutoring', { required: true })} />
                                        <span>Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" value="No" {...register('previousTutoring', { required: true })} />
                                        <span>No</span>
                                    </label>
                                </div>
                                {errors.previousTutoring && <p className="text-sm text-orange-500 font-light">This information is required</p>}
                            </div>

                            <div className="grid grid-cols-1 my-2 md:my-3 gap-2">
                                <label htmlFor="specificGoals" className="flex items-center gap-1">
                                    <span>What specific goals do you have for this session? *</span>
                                </label>
                                <textarea id="specificGoals" placeholder="e.g., Improve logical reasoning skills, learn time management strategies, understand specific question types..." className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" rows={3} {...register('specificGoals', { required: true })}></textarea>
                                {errors.specificGoals && <p className="text-sm text-orange-500 font-light">Please specify your goals for this session</p>}
                            </div>

                            <div className="grid grid-cols-1 my-2 md:my-3 gap-2">
                                <label htmlFor="notes" className="flex items-center gap-1">
                                    <span>Additional Notes or Questions</span>
                                </label>
                                <textarea id="notes" placeholder="Any other information you'd like to share with your tutor..." className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" rows={3} {...register('notes', { required: false })}></textarea>
                            </div>

                            <div className="text-gray-600 grid grid-cols-1 my-4">
                                <label className="flex items-center gap-1 text-sm">
                                    <File size={18} />
                                    <span>Upload any relevant documents (practice tests, score reports, etc.)</span>
                                </label>
                                <FileInput {...register('document', { required: false })} />
                            </div>
                        </form>
                    </div>
                </section>

                {/* Review Order */}
                <section>
                    <h5 className="font-semibold text-blue-950 md:mt-16">Session Details</h5>

                    <div className="bg-blue-50 border border-blue-100 p-5 rounded-md mb-8 mt-5 md:sticky md:top-20 shadow-lg shadow-blue-100">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 p-2.5 rounded-full mr-4 w-10 h-10 flex items-center justify-center">
                                <UserCheck2 className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-blue-950">
                                {sessionType === 'free' ? 'Free Consultation' :
                                    sessionType === 'one-on-one' ? '1-on-1 Tutoring' :
                                        'Group Class Session'}
                            </h3>
                        </div>

                        {/* Selected Tutor Info */}
                        {selectedTutor && getSelectedTutor() && (
                            <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200">
                                <p className="font-semibold text-blue-900 mb-2">Selected Tutor:</p>
                                <div className="flex items-center gap-3">
                                    {getSelectedTutor().image && (
                                        <img
                                            src={getSelectedTutor().image}
                                            alt={getSelectedTutor().fullName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">{getSelectedTutor().fullName}</p>
                                        <p className="text-sm text-gray-600">{getSelectedTutor().school}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock size={16} />
                                <span>
                                    {sessionType === 'free' ? '30-minute session' :
                                        sessionType === 'one-on-one' ? '1-hour personalized session' :
                                            '1-hour group session'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <BookOpen size={16} />
                                <span>
                                    {sessionType === 'free' ? 'Strategy consultation & goal setting' :
                                        sessionType === 'one-on-one' ? 'Focused LSAT section review' :
                                            'Comprehensive group learning with peer interaction'}
                                </span>
                            </div>
                            {sessionType === 'class' && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users size={16} />
                                    <span>{numberOfStudents} students in group</span>
                                </div>
                            )}
                        </div>

                        {/* <p className="text-gray-600 mb-4">
                            {sessionType === 'free' 
                                ? 'Get personalized advice and a roadmap for your LSAT preparation journey from an experienced tutor.'
                                : sessionType === 'one-on-one'
                                ? 'Deep dive into specific LSAT sections with targeted practice and expert guidance.'
                                : 'Learn together with peers in an interactive group setting, perfect for collaborative learning and motivation.'
                            }
                        </p> */}

                        <div className="mt-5 text-gray-600">
                            <div className="space-y-2 mb-4">
                                <p className="flex justify-between">
                                    <span>Session Type:</span>
                                    <span className="font-semibold">
                                        {sessionType === 'free' ? 'Free Consultation' :
                                            sessionType === 'one-on-one' ? '1-on-1 Tutoring' :
                                                'Group Class'}
                                    </span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Duration:</span>
                                    <span>
                                        {sessionType === 'free' ? '30 minutes' :
                                            sessionType === 'one-on-one' ? '60 minutes' :
                                                '60 minutes'}
                                    </span>
                                </p>
                                {sessionType === 'class' && (
                                    <>
                                        <p className="flex justify-between">
                                            <span>Number of Students:</span>
                                            <span>{numberOfStudents}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Price per Person:</span>
                                            <span>${currentPricing.perPerson}</span>
                                        </p>
                                    </>
                                )}
                                <p className="flex justify-between">
                                    <span>Cost:</span>
                                    <span className="font-bold text-green-600">
                                        {sessionType === 'free' ? 'Free' :
                                            sessionType === 'one-on-one' ? '1 Session' :
                                                `$${currentPricing.total}`}
                                    </span>
                                </p>
                            </div>

                            {sessionType === 'one-on-one' && selectedPackage && (
                                <div className="bg-white p-3 rounded border border-blue-200 mb-4">
                                    <p className="text-sm font-semibold text-blue-900">Using Package Session</p>
                                    <p className="text-sm text-gray-600">
                                        This session will use 1 credit from your selected package
                                    </p>
                                </div>
                            )}

                            {sessionType === 'class' && (
                                <div className="bg-white p-3 rounded border border-blue-200 mb-4">
                                    <p className="text-sm font-semibold text-blue-900">Group Discount Applied</p>
                                    <p className="text-sm text-gray-600">
                                        {numberOfStudents === 2 && '2 students: $70 per person'}
                                        {numberOfStudents === 3 && '3 students: $65 per person'}
                                        {numberOfStudents === 4 && '4 students: $60 per person'}
                                        {numberOfStudents === 5 && '5 students: $55 per person'}
                                    </p>
                                </div>
                            )}

                            <label className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                        setIsChecked(e.target.checked);
                                        setTermsWarning(!e.target.checked);
                                    }}
                                />
                                <span>I have read and agree to the <Link className="text-blue-600 underline" to="/terms-conditions">terms & conditions.</Link></span>
                            </label>

                            <p className={`text-orange-500 text-sm my-2 ${termsWarning ? 'block' : 'hidden'}`}>
                                You need to accept the Terms and Conditions to proceed.
                            </p>

                            <button
                                onClick={() => formRef.current.requestSubmit()}
                                type="button"
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white rounded cursor-pointer w-full my-5"
                                disabled={sessionType === 'one-on-one' && userPackages.length === 0}
                            >
                                {
                                    !isBooking ? (
                                        sessionType === 'free' ? 'Book Free Session' :
                                            sessionType === 'one-on-one' ? 'Book 1-on-1 Session' :
                                                `Book Group Session - $${currentPricing.total}`
                                    ) : (
                                        <span className="flex space-x-1 items-center justify-center py-2">
                                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                                        </span>
                                    )
                                }
                            </button>

                            {sessionType === 'one-on-one' && userPackages.length === 0 && (
                                <p className="text-orange-500 text-sm text-center">
                                    You need an active package to book 1-on-1 sessions
                                </p>
                            )}

                            <div className="text-sm text-gray-500">
                                <p className="flex items-center gap-1 text-sm font-semibold text-black mb-1.5">
                                    <LockKeyholeIcon size={18} strokeWidth={1.5} /> Secured Booking - SSL Encrypted
                                </p>
                                <p>Your personal and session information is protected and confidential.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </Container>
        </section>
    );
}

export default CheckoutLSATSession;