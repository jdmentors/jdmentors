import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from "react-router";
import { AdminLayout, Home, UserLayout } from './pages';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './app/store.js';
import { Provider } from 'react-redux';
import { AdminRoute, LoadingSpinner, Protected } from './components/index.js';
import { lazy, Suspense } from 'react';

const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const Accommodations = lazy(() => import('./pages/Accommodations'));
const Addons = lazy(() => import('./pages/Addons'));
const Extras = lazy(() => import('./pages/Extras'));
const Packages = lazy(() => import('./pages/Packages'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Blogs = lazy(() => import('./pages/Blogs'));
const LSATTutoring = lazy(() => import('./pages/LSATTutoring'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const SingleBlog = lazy(() => import('./pages/SingleBlog'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckoutAccommodations = lazy(() => import('./pages/CheckoutAccommodations'));
const CheckOutAccommodationSuccess = lazy(() => import('./pages/CheckoutAccommodationSuccess'));
const CheckoutLSATPackageSuccess = lazy(() => import('./pages/LSATPackageSuccess'));
const CheckOutLsatPackage = lazy(() => import('./pages/LSATPackageCheckout'));
const CheckOutSuccess = lazy(() => import('./pages/CheckOutSuccess'));
const SessionStatus = lazy(() => import('./pages/SessionStatus'));
const CheckOutCancel = lazy(() => import('./pages/CheckOutCancel'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AllSessions = lazy(() => import('./pages/admin/AllSessions'));
const AllSessionsAccommodations = lazy(() => import('./pages/admin/AllSessionsAccommodations'));
const AllCoupons = lazy(() => import('./pages/admin/AllCoupons'));
const AllBlogs = lazy(() => import('./pages/admin/AllBlogs'));
const AllUsers = lazy(() => import('./pages/admin/AllUsers'));
const AllServices = lazy(() => import('./pages/admin/AllServices'));
const AllAddons = lazy(() => import('./pages/admin/AllAddons'));
const AllExtras = lazy(() => import('./pages/admin/AllExtras'));
const AllPackages = lazy(() => import('./pages/admin/AllPackages'));
const EditBlog = lazy(() => import('./pages/admin/EditBlog'));
const EditCoupon = lazy(() => import('./pages/admin/EditCoupon'));
const EditService = lazy(() => import('./pages/admin/EditService'));
const EditAddon = lazy(() => import('./pages/admin/EditAddon'));
const EditExtra = lazy(() => import('./pages/admin/EditExtra'));
const EditPackage = lazy(() => import('./pages/admin/EditPackage'));
const AddBlog = lazy(() => import('./pages/admin/AddBlog'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AddService = lazy(() => import('./pages/admin/AddService'));
const AddAddon = lazy(() => import('./pages/admin/AddAddon'));
const AddExtra = lazy(() => import('./pages/admin/AddExtra'));
const AddPackage = lazy(() => import('./pages/admin/AddPackage'));
const AddCoupon = lazy(() => import('./pages/admin/AddCoupon'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const Profile = lazy(() => import('./components/Profile'));
const CreateAdmin = lazy(() => import('./components/admin/CreateAdmin'));
const AddTeam = lazy(() => import('./pages/admin/AddTeam'));
const AddTutor = lazy(() => import('./pages/admin/AddTutor'));
const AllTeam = lazy(() => import('./pages/admin/AllTeam'));
const AllTutors = lazy(() => import('./pages/admin/AllTutors'));
const LSATTutoringAdmin = lazy(() => import('./pages/admin/LSATTutoring'));
const UpdateTeam = lazy(() => import('./pages/admin/UpdateTeam'));
const UpdateTutor = lazy(() => import('./pages/admin/UpdateTutor'));
const TutorDashboard = lazy(() => import('./pages/tutor/TutorDashboard'));
const TutorProfile = lazy(() => import('./pages/tutor/TutorProfile'));
const TutorLayout = lazy(() => import('./pages/tutor/TutorLayout'));
const TutorResetPassword = lazy(() => import('./pages/TutorResetPassword'));
const LSATPackageSuccess = lazy(() => import('./pages/LSATPackageSuccess'));
const CheckoutLSATSession = lazy(() => import('./pages/CheckoutLSATSession'));
const AddLSATPackage = lazy(() => import('./pages/admin/AddLSATPackage'));
const EditLSATPackage = lazy(() => import('./pages/admin/EditLSATPackage'));
const AllLSATPackages = lazy(() => import('./pages/admin/AllLSATPackages'));
const LSATSessionSuccess = lazy(() => import('./pages/LSATSessionSuccess'));
const AllLSATSessions = lazy(() => import('./pages/admin/AllLSATSessions'));
const AllAdmissionSessions = lazy(() => import('./pages/user/AllAdmissionSessions'));
const AllAccommodationSessions = lazy(() => import('./pages/user/AllAccommodationSessions'));
const AllLSATSessionsUser = lazy(() => import('./pages/user/AllLSATSessions'));

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <PersistGate persistor={persistor}>
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<App />}>
                            <Route path='' element={<Home />} />
                            <Route path='/checkout-success/:sessionId' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><CheckOutSuccess /></Suspense>} />

                            <Route path='/checkout-accommodation-success/:accommodationId' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><CheckOutAccommodationSuccess /></Suspense>} />

                            <Route path='/checkout-lsat-package-success/:purchaseId' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><CheckoutLSATPackageSuccess /></Suspense>} />

                            <Route path='/session-status' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><SessionStatus /></Suspense>} />

                            <Route path='/checkout-cancel' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><CheckOutCancel /></Suspense>} />

                            <Route path='/checkout/:serviceType/:serviceId' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><Checkout /></Suspense>} />

                            <Route path='/checkout/accommodations' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><CheckoutAccommodations /></Suspense>} />

                            <Route path='/checkout/lsat-session' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><CheckoutLSATSession /></Suspense>} />

                            <Route path='/checkout/lsat-package/:packageId' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><CheckOutLsatPackage /></Suspense>} />

                            <Route path="/checkout-lsat-package-success/:purchaseId" element={<LSATPackageSuccess />} />

                            <Route path="/checkout-lsat-session-success/:sessionId" element={<LSATSessionSuccess />} />

                            <Route path='/contact' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><Contact /></Suspense>} />

                            <Route path='/services' element={<Suspense fallback={<LoadingSpinner height={'725px'} />}><Services /></Suspense>} />

                            <Route path='/accommodations' element={<Suspense fallback={<LoadingSpinner height={'725px'} />}><Accommodations /></Suspense>} />

                            <Route path='/addons' element={<Suspense fallback={<LoadingSpinner height={'725px'} />}><Addons /></Suspense>} />

                            <Route path='/extras' element={<Suspense fallback={<LoadingSpinner height={'725px'} />}><Extras /></Suspense>} />

                            <Route path='/packages' element={<Suspense fallback={<LoadingSpinner height={'725px'} />}><Packages /></Suspense>} />

                            <Route path='/reset-password' element={<Suspense fallback={<LoadingSpinner height={'725px'} />}><ResetPassword /></Suspense>} />

                            {/* <Route path='/testimonials' element={<Suspense fallback={<LoadingSpinner height={"850px"} />}><Testimonials /></Suspense>} /> */}

                            <Route path='/about' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AboutUs /></Suspense>} />

                            <Route path='*' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><PageNotFound /></Suspense>} />

                            <Route path='/blogs' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><Blogs /></Suspense>} />

                            <Route path='/privacy-policy' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><PrivacyPolicy /></Suspense>} />

                            <Route path='/terms-conditions' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><TermsAndConditions /></Suspense>} />

                            <Route path='/blogs/:slug' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><SingleBlog /></Suspense>} />

                            <Route path='/lsat-tutoring' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><LSATTutoring /></Suspense>} />

                            <Route path='/secure/auth/login/admin' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AdminLogin /></Suspense>} />

                            <Route path='/tutor-reset-password' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><TutorResetPassword /></Suspense>} />
                        </Route>

                        <Route path='/user' element={<UserLayout />}>
                            <Route path='/user/dashboard' element={<Protected authetication={true}>
                                <Suspense fallback={<LoadingSpinner height={'750px'} />}>
                                    <UserDashboard />
                                </Suspense>
                            </Protected>} />
                            <Route path='/user/admissions' element={<Protected authetication={true}>
                                <Suspense fallback={<LoadingSpinner height={'750px'} />}>
                                    <AllAdmissionSessions />
                                </Suspense>
                            </Protected>} />
                            <Route path='/user/accommodations' element={<Protected authetication={true}>
                                <Suspense fallback={<LoadingSpinner height={'750px'} />}>
                                    <AllAccommodationSessions />
                                </Suspense>
                            </Protected>} />
                            <Route path='/user/lsat' element={<Protected authetication={true}>
                                <Suspense fallback={<LoadingSpinner height={'750px'} />}>
                                    <AllLSATSessionsUser />
                                </Suspense>
                            </Protected>} />
                        </Route>

                        <Route path='/tutor' element={<TutorLayout />}>
                            <Route path='/tutor/dashboard' element={<Protected authetication={true}>
                                <Suspense fallback={<LoadingSpinner height={'750px'} />}>
                                    <TutorDashboard />
                                </Suspense>
                            </Protected>} />
                            <Route path='/tutor/profile' element={<Protected authetication={true}>
                                <Suspense fallback={<LoadingSpinner height={'750px'} />}>
                                    <TutorProfile />
                                </Suspense>
                            </Protected>} />
                        </Route>

                        <Route path='/admin' element={<AdminRoute><AdminLayout /></AdminRoute>}>
                            <Route path='/admin/dashboard' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AdminDashboard /></Suspense>} />

                            <Route path='/admin/admissions' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllSessions /></Suspense>} />

                            <Route path='/admin/accommodations' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllSessionsAccommodations /></Suspense>} />

                            <Route path='/admin/coupons' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllCoupons /></Suspense>} />

                            <Route path='/admin/users' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllUsers /></Suspense>} />

                            <Route path='/admin/services' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllServices /></Suspense>} />

                            <Route path='/admin/addons' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllAddons /></Suspense>} />

                            <Route path='/admin/extras' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllExtras /></Suspense>} />

                            <Route path='/admin/packages' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllPackages /></Suspense>} />

                            <Route path='/admin/services/add' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AddService /></Suspense>} />

                            <Route path='/admin/addons/add' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AddAddon /></Suspense>} />

                            <Route path='/admin/extras/add' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AddExtra /></Suspense>} />

                            <Route path='/admin/packages/add' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AddPackage /></Suspense>} />

                            <Route path='/admin/coupons/add' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AddCoupon /></Suspense>} />

                            <Route path='/admin/services/edit/:serviceId' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><EditService /></Suspense>} />

                            <Route path='/admin/addons/edit/:addonId' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><EditAddon /></Suspense>} />

                            <Route path='/admin/extras/edit/:extraId' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><EditExtra /></Suspense>} />

                            <Route path='/admin/packages/edit/:packageId' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><EditPackage /></Suspense>} />

                            <Route path='/admin/blogs' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllBlogs /></Suspense>} />

                            <Route path='/admin/blogs/add' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AddBlog /></Suspense>} />

                            <Route path='/admin/blogs/edit/:slug' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><EditBlog /></Suspense>} />

                            <Route path='/admin/coupons/edit/:couponId' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><EditCoupon /></Suspense>} />

                            <Route path='/admin/profile' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><Profile /></Suspense>} />

                            <Route path='/admin/create' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><CreateAdmin /></Suspense>} />

                            <Route path='/admin/team/all' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllTeam /></Suspense>} />

                            <Route path='/admin/lsat-tutoring' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><LSATTutoringAdmin /></Suspense>} />

                            <Route path='/admin/tutors/all' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllTutors /></Suspense>} />

                            <Route path='/admin/team/add' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AddTeam /></Suspense>} />

                            <Route path='/admin/tutors/add' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AddTutor /></Suspense>} />

                            <Route path='/admin/team/update/:id' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><UpdateTeam /></Suspense>} />

                            <Route path='/admin/tutors/update/:id' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><UpdateTutor /></Suspense>} />

                            <Route path='/admin/lsat-packages/add' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AddLSATPackage /></Suspense>} />

                            <Route path='/admin/lsat-packages/edit/:packageId' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><EditLSATPackage /></Suspense>} />

                            <Route path='/admin/lsat-packages' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllLSATPackages /></Suspense>} />

                            <Route path='/admin/lsat-sessions' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllLSATSessions /></Suspense>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </PersistGate>
    </StrictMode>,
)