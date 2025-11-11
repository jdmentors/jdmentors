// hooks/useRefreshTokenTutor.js
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { updateUser, toggleIsUserLoggedIn, toggleShowUserAuthForm } from '../features/forms/UserAuthSlice.js';
import axios from 'axios';

const useRefreshTokenTutor = () => {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const refreshAccessToken = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/refresh-access-token`,
                { headers: { Authorization: `Bearer ${user.refreshToken}` } }
            );

            if (data && data.success) {
                dispatch(updateUser({ ...user, accessToken: data.data.accessToken }));
                return data.data.accessToken;
            }
        } catch (error) {
            if (error?.response?.data?.message === 'refreshToken') {
                dispatch(updateUser({}));
                dispatch(toggleIsUserLoggedIn(false));
                dispatch(toggleShowUserAuthForm(true));
                navigate('/');
            } else {
                console.error(error);
            }
        }
    };

    return refreshAccessToken;
};

export default useRefreshTokenTutor;