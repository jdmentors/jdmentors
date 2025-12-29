// hooks/useGoogleReviews.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const useGoogleReviews = (placeId) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [businessInfo, setBusinessInfo] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!placeId) {
                setError('Place ID is missing');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                const { data } = await axios.get(
                    `${import.meta.env.VITE_DOMAIN_URL}/api/v1/google/reviews`,
                    {
                        params: { placeId },
                        timeout: 15000 // 15 second timeout
                    }
                );

                if (data && data.success) {
                    setReviews(data.data.reviews || []);
                    setBusinessInfo(data.data.business);
                } else {
                    setError(data?.message || 'Failed to fetch reviews');
                }
            } catch (error) {
                console.error('Error fetching Google reviews:', error);
                
                if (error.response) {
                    // Backend returned an error
                    setError(error.response.data?.message || 'Backend error');
                } else if (error.request) {
                    // No response received
                    setError('Network error. Please check your connection.');
                } else {
                    setError(error.message || 'An error occurred');
                }
                
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [placeId]);

    return { reviews, businessInfo, loading, error };
};

export default useGoogleReviews;