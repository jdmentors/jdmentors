import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showUserAuthForm: false,
    isUserLoggedIn: false,
    user: {},
    authType: 'user', // 'user' or 'tutor'
};

const UserAuthFormSlice = createSlice({
    name: 'userAuthForm',
    initialState,
    reducers: {
        toggleShowUserAuthForm: (state, action) => {
            state.showUserAuthForm = action.payload;
        },

        toggleIsUserLoggedIn: (state, action) => {
            state.isUserLoggedIn = action.payload;
        },

        updateUser: (state, action) => {
            state.user = action.payload;
        },

        setAuthType: (state, action) => {
            state.authType = action.payload;
        },

        // Combined action to show auth form with specific type
        showAuthForm: (state, action) => {
            state.showUserAuthForm = true;
            state.authType = action.payload || 'user';
        }
    }
})

export const { 
    toggleShowUserAuthForm, 
    toggleIsUserLoggedIn, 
    updateUser, 
    setAuthType,
    showAuthForm 
} = UserAuthFormSlice.actions;

export const UserAuthFormReducers = UserAuthFormSlice.reducer;