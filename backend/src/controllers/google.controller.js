// controllers/google.controller.js
import axios from 'axios';

/**
 * @desc    Fetch Google reviews for a business
 * @route   GET /api/google/reviews
 * @access  Public
 */
const getGoogleReviews = async (req, res) => {
    try {
        const { placeId } = req.query;
        
        if (!placeId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Google Place ID is required.' 
            });
        }

        // Get API key from environment variables
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        // console.log(apiKey);
        
        if (!apiKey) {
            console.error('Google Places API key is not configured');
            return res.status(500).json({ 
                success: false, 
                message: 'Service configuration error.' 
            });
        }

        // Make request to Google Places API
        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/place/details/json',
            {
                params: {
                    place_id: placeId,
                    fields: 'reviews,name,rating',
                    key: apiKey,
                    language: 'en' // Optional: set language
                },
                timeout: 10000 // 10 second timeout
            }
        );

        const data = response.data;

        // Handle Google API errors
        if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
            console.error('Google Places API error:', data.status, data.error_message);
            return res.status(400).json({ 
                success: false, 
                message: `Google API error: ${data.status}` 
            });
        }

        if (!data.result || !data.result.reviews || data.result.reviews.length === 0) {
            return res.status(200).json({ 
                success: true, 
                data: [], 
                message: 'No reviews found.' 
            });
        }

        // Format the response
        const formattedReviews = data.result.reviews.map(review => ({
            author_name: review.author_name,
            author_photo: review.profile_photo_url,
            rating: review.rating,
            text: review.text,
            time: review.time * 1000, // Convert to milliseconds
            relative_time: review.relative_time_description,
            language: review.language
        }));

        // Sort by newest first
        formattedReviews.sort((a, b) => b.time - a.time);

        // Get business info
        const businessInfo = {
            name: data.result.name || 'Business',
            overall_rating: data.result.rating || 0
        };

        return res.status(200).json({ 
            success: true, 
            data: {
                business: businessInfo,
                reviews: formattedReviews.slice(0, 8) // Limit to 8 most recent
            },
            message: 'Google reviews fetched successfully.'
        });

    } catch (error) {
        console.error('Error fetching Google reviews:', error.message);
        
        // Handle specific error cases
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                success: false, 
                message: 'Unable to connect to Google services.' 
            });
        }
        
        if (error.response) {
            // Google API returned an error
            return res.status(error.response.status).json({ 
                success: false, 
                message: error.response.data.error_message || 'Google API error.' 
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error while fetching reviews.' 
        });
    }
};

export { getGoogleReviews };