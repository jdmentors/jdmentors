import axios from "axios";

function useGetAllLSATPackages(){
    const fetchedLSATPackages = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/all`);

            if(data && data.success){
                return data.data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return fetchedLSATPackages;
}

export default useGetAllLSATPackages;