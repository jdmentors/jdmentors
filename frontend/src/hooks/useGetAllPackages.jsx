import axios from "axios";

function useGetAllPackages(){
    const fetchedPackages = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/packages/all`);

            if(data && data.success){
                return data.data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return fetchedPackages;
}

export default useGetAllPackages;