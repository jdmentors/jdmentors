import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showUserAuthForm: false,
    isUserLoggedIn: false,
    user:{},
};

const UserAuthFormSlice = createSlice({
    name:'userAuthForm',
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
        }
    }
})

export const { toggleShowUserAuthForm, toggleIsUserLoggedIn, updateUser } = UserAuthFormSlice.actions;

export const UserAuthFormReducers = UserAuthFormSlice.reducer;