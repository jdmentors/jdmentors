import axios from "axios";

function useGetAllBlogs(){
    const fetchedBlogs = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/blogs/all`);

            if(data && data.success){
                return data.data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return fetchedBlogs;
}

export default useGetAllBlogs;