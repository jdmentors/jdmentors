import axios from "axios";

function useGetAllExtras(){
    const fetchedExtras = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/extras/all`);

            if(data && data.success){
                return data.data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return fetchedExtras;
}

export default useGetAllExtras;