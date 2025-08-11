import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from "react-router";
import { AboutUs, AddBlog, AddService, AdminDashboard, AdminLayout, AllBlogs, AllServices, AllSessions, AllUsers, Blogs, Checkout, CheckOutCancel, CheckOutSuccess, Contact, EditBlog, EditService, Home, ResetPassword, Services, SingleBlog, Testimonials, UserDashboard, UserLayout } from './pages';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './app/store.js';
import { Provider } from 'react-redux';
import { AdminRoute, CreateAdmin, Profile, Protected } from './components/index.js';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <PersistGate persistor={persistor}>
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<App />}>
                            <Route path='' element={<Home />} />
                            <Route path='/checkout-success/:sessionId' element={<CheckOutSuccess />} />
                            <Route path='/checkout-cancel' element={<CheckOutCancel />} />
                            <Route path='/checkout/:serviceId' element={<Checkout />} />
                            <Route path='/contact' element={<Contact />} />
                            <Route path='/services' element={<Services />} />
                            <Route path='/testimonials' element={<Testimonials />} />
                            <Route path='/about' element={<AboutUs />} />
                            <Route path='/reset-password' element={<ResetPassword />} />
                            <Route path='/blogs' element={<Blogs />} />
                            <Route path='/blogs/:slug' element={<SingleBlog />} />
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