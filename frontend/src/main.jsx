import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from "react-router";
import { AboutUs, Blogs, Checkout, Contact, Home, Services, SingleBlog, Testimonials, UserDashboard, UserLayout } from './pages';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './app/store.js';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <PersistGate persistor={persistor}>
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<App />}>
                            <Route path='' element={<Home />} />
                            <Route path='/checkout/:serviceId' element={<Checkout />} />
                            <Route path='/contact' element={<Contact />} />
                            <Route path='/services' element={<Services />} />
                            <Route path='/testimonials' element={<Testimonials />} />
                            <Route path='/about' element={<AboutUs />} />
                            <Route path='/blogs' element={<Blogs />} />
                            <Route path='/blogs/:blogId' element={<SingleBlog />} />
                        </Route>

                        <Route path='/user' element={<UserLayout />}>
                            <Route path='/user/dashboard' element={<UserDashboard />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </PersistGate>
    </StrictMode>,
)