import axios from "axios";

function useGetAllAddons(){
    const fetchedAddons = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/addons/all`);

            if(data && data.success){
                return data.data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return fetchedAddons;
}

export default useGetAllAddons;