import { useState } from "react";
import axios from "axios";

const useGetAllTutor = () => {
    const [loading, setLoading] = useState(false);

    const getAllTutors = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/all`);
            if (data.success) {
                return data.data;
            }
        } catch (error) {
            console.error('Failed to fetch tutors:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    return getAllTutors;
};

export default useGetAllTutor;