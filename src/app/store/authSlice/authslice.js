import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
        adminUsers: [],
    },
    reducers: {
        loginDispatch: (state, action) => {
            state.isAuthenticated = true;
            state.user = { ...action.payload.user };
            state.token = action.payload.token;
            state.loading = false;
            state.error = null;
        },
        profileDispatch: (state, action) => {
            state.isAuthenticated = true;
            state.user = { ...action.payload };
            state.loading = false;
            state.error = null;
        },
        logoutDispatch: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.adminUsers = [];
        },
        registerDispatch: (state, action) => {
            state.isAuthenticated = true;
            state.user = { ...action.payload };
            state.token = action.payload.token;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    setError,
    setLoading,
    loginDispatch,
    logoutDispatch,
    profileDispatch,
    registerDispatch,
    stateUserDispatch,
} = authSlice.actions;

export default authSlice.reducer;
