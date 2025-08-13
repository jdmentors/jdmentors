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
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Blogs = lazy(() => import('./pages/Blogs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const SingleBlog = lazy(() => import('./pages/SingleBlog'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckOutSuccess = lazy(() => import('./pages/CheckOutSuccess'));
const CheckOutCancel = lazy(() => import('./pages/CheckOutCancel'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AllSessions = lazy(() => import('./pages/admin/AllSessions'));
const AllBlogs = lazy(() => import('./pages/admin/AllBlogs'));
const AllUsers = lazy(() => import('./pages/admin/AllUsers'));
const AllServices = lazy(() => import('./pages/admin/AllServices'));
const EditBlog = lazy(() => import('./pages/admin/EditBlog'));
const EditService = lazy(() => import('./pages/admin/EditService'));
const AddBlog = lazy(() => import('./pages/admin/AddBlog'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AddService = lazy(() => import('./pages/admin/AddService'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const Profile = lazy(() => import('./components/Profile'));
const CreateAdmin = lazy(() => import('./components/admin/CreateAdmin'));

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <PersistGate persistor={persistor}>
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<App />}>
                            <Route path='' element={<Home />} />
                            <Route path='/checkout-success/:sessionId' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><CheckOutSuccess /></Suspense>} />

                            <Route path='/checkout-cancel' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><CheckOutCancel /></Suspense>} />

                            <Route path='/checkout/:serviceId' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><Checkout /></Suspense>} />

                            <Route path='/contact' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><Contact /></Suspense>} />

                            <Route path='/services' element={<Suspense fallback={<LoadingSpinner height={'725px'} />}><Services /></Suspense>} />

                            <Route path='/testimonials' element={<Suspense fallback={<LoadingSpinner height={"850px"} />}><Testimonials /></Suspense>} />

                            <Route path='/about' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AboutUs /></Suspense>} />

                            <Route path='*' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><PageNotFound /></Suspense>} />

                            <Route path='/blogs' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><Blogs /></Suspense>} />

                            <Route path='/privacy-policy' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><PrivacyPolicy /></Suspense>} />

                            <Route path='/terms-conditions' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><TermsAndConditions /></Suspense>} />

                            <Route path='/blogs/:slug' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><SingleBlog /></Suspense>} />

                            <Route path='/secure/auth/login/admin' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AdminLogin /></Suspense>} />
                        </Route>

                        <Route path='/user' element={<UserLayout />}>
                            <Route path='/user/dashboard' element={<Protected authetication={true}>
                                <Suspense fallback={<LoadingSpinner height={'750px'} />}>
                                    <UserDashboard />
                                </Suspense>
                            </Protected>} />
                        </Route>

                        <Route path='/admin' element={<AdminRoute><AdminLayout /></AdminRoute>}>
                            <Route path='/admin/dashboard' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AdminDashboard /></Suspense>} />

                            <Route path='/admin/sessions' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllSessions /></Suspense>} />

                            <Route path='/admin/users' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllUsers /></Suspense>} />

                            <Route path='/admin/services' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllServices /></Suspense>} />

                            <Route path='/admin/services/add' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AddService /></Suspense>} />

                            <Route path='/admin/services/edit/:serviceId' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><EditService /></Suspense>} />

                            <Route path='/admin/blogs' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AllBlogs /></Suspense>} />

                            <Route path='/admin/blogs/add' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><AddBlog /></Suspense>} />

                            <Route path='/admin/blogs/edit/:slug' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><EditBlog /></Suspense>} />

                            <Route path='/admin/profile' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><Profile /></Suspense>} />

                            <Route path='/admin/create' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><CreateAdmin /></Suspense>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </PersistGate>
    </StrictMode>,
)