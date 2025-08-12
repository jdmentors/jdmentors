import axios from "axios";

function useGetAllServices(){
    const fetchedServices = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/all`);

            if(data && data.success){
                return data.data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return fetchedServices;
}

export default useGetAllServices;