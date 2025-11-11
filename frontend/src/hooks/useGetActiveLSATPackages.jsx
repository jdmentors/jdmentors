import axios from "axios";

function useGetActiveLSATPackages(){
    const fetchedActiveLSATPackages = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/active`);

            if(data && data.success){
                return data.data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return fetchedActiveLSATPackages;
}

export default useGetActiveLSATPackages;