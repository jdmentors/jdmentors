// hooks/useClassPricing.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import useRefreshToken from './useRefreshToken';
import { updateUser } from '../features/forms/UserAuthSlice';
import { useDispatch } from 'react-redux';

const useClassPricing = () => {
    const [pricing, setPricing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();

    const fetchPricing = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const { data } = await axios.get(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/pricing`
            );

            if (data && data.success) {
                setPricing(data.data);
            } else {
                setError('Failed to fetch pricing data');
            }
        } catch (error) {
            console.error('Error fetching pricing:', error);
            setError('Failed to load pricing data');
            
            // If there's an access token issue, try refreshing
            if (error?.response?.data?.message === 'accessToken' && user?.accessToken) {
                try {
                    const newAccessToken = await refreshAccessToken();
                    const { data } = await axios.get(
                        `${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/pricing`,
                        { headers: { Authorization: `Bearer ${newAccessToken}` } }
                    );

                    if (data && data.success) {
                        setPricing(data.data);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setError(null);
                    }
                } catch (refreshError) {
                    console.error('Error with refreshed token:', refreshError);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPricing();
    }, []);

    const calculatePricing = (students) => {
        if (!pricing) {
            // Fallback to default pricing while loading
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

    const refreshPricing = () => {
        fetchPricing();
    };

    return {
        pricing,
        loading,
        error,
        calculatePricing,
        refreshPricing
    };
};

export default useClassPricing;