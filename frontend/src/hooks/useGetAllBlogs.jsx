import axios from "axios";
import toast from "react-hot-toast";

function useGetAllBlogs(){
    const fetchedBlogs = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/blogs/all`);

            if(data && data.success){
                return data.data;
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message);
        }
    }

    return fetchedBlogs;
}

export default useGetAllBlogs;