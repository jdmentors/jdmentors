import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "./useRefreshToken";
import { updateUser } from "../features/forms/UserAuthSlice.js";

function useGetAllUsers(){
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();

    const fetchedUsers = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/users/all`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if(data && data.success){
                return data.data;
            }
        } catch (error) {
            const message = error?.response?.data?.message;

            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/users/all`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        return data.data;
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    return fetchedUsers;
}

export default useGetAllUsers;