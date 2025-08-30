import axios from "axios";

function useGetAllTeam(){
    const fetchedTeam = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/team/all`);

            if(data && data.success){
                return data.data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return fetchedTeam;
}

export default useGetAllTeam;