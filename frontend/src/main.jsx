import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from "react-router";
import { AddBlog, AddService, AdminDashboard, AdminLayout, AllBlogs, AllServices, AllSessions, AllUsers, EditBlog, EditService, Home, ResetPassword, UserDashboard, UserLayout } from './pages';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './app/store.js';
import { Provider } from 'react-redux';
import { AdminRoute, CreateAdmin, LoadingSpinner, Profile, Protected } from './components/index.js';
import { lazy, Suspense } from 'react';

const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Blogs = lazy(() => import('./pages/Blogs'));
const SingleBlog = lazy(() => import('./pages/SingleBlog'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckOutSuccess = lazy(() => import('./pages/CheckOutSuccess'));
const CheckOutCancel = lazy(() => import('./pages/CheckOutCancel'));

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

                            <Route path='/reset-password' element={<ResetPassword />} />

                            <Route path='/blogs' element={<Suspense fallback={<LoadingSpinner height={'850px'} />}><Blogs /></Suspense>} />

                            <Route path='/blogs/:slug' element={<Suspense fallback={<LoadingSpinner height={'750px'} />}><SingleBlog /></Suspense>} />
                        </Route>

                        <Route path='/user' element={<UserLayout />}>
                            <Route path='/user/dashboard' element={<Protected authetication={true}><UserDashboard /></Protected>} />
                        </Route>

                        <Route path='/admin' element={<AdminRoute><AdminLayout /></AdminRoute>}>
                            <Route path='/admin/dashboard' element={<AdminDashboard />} />
                            <Route path='/admin/sessions' element={<AllSessions />} />
                            <Route path='/admin/users' element={<AllUsers />} />
                            <Route path='/admin/services' element={<AllServices />} />
                            <Route path='/admin/services/add' element={<AddService />} />
                            <Route path='/admin/services/edit/:serviceId' element={<EditService />} />
                            <Route path='/admin/blogs' element={<AllBlogs />} />
                            <Route path='/admin/blogs/add' element={<AddBlog />} />
                            <Route path='/admin/blogs/edit/:slug' element={<EditBlog />} />
                            <Route path='/admin/profile' element={<Profile />} />
                            <Route path='/admin/create' element={<CreateAdmin />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </PersistGate>
    </StrictMode>,
)