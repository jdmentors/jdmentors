import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from "react-router";
import { Checkout, Home } from './pages';
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
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </PersistGate>
    </StrictMode>,
)