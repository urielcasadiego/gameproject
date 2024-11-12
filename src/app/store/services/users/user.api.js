import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL_USERS,
        prepareHeaders: (headers, { getState, endpoint }) => {
            const token = getState().auth.token;
            if (token && endpoint !== 'loginUser') {
                headers.set('Authorization', `Bearer ${token}`);
            }
            if (!(endpoint === 'uploadImage')) {
                headers.set('Content-Type', 'application/json');
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (body) => ({
                url: 'auth/login',
                method: 'POST',
                body,
            }),
        }),

        getvalidToken: builder.query({
            query: () => ({
                url: `auth/token-validate`,
                method: 'GET',
            }),
        }),

        getAllUsers: builder.query({
            query: ({ page, limit }) => ({
                url: `users/admin?page=${page}&limit=${limit}`,
                method: 'GET',
            }),
        }),

        patchData: builder.mutation({
            query: ({ userId, data }) => ({
                url: `users/admin/block/${userId}`,
                method: 'PATCH',
                body: data,
            }),
        }),

        deleteData: builder.mutation({
            query: ({ userId, data }) => ({
                url: `users/admin/delete/${userId}`,
                method: 'DELETE',
                body: data,
            }),
        }),

        registerUser: builder.mutation({
            query: (body) => ({
                url: 'users/register',
                method: 'POST',
                body,
            }),
        }),

        updateUserProfile: builder.mutation({
            query: ({ userId, body }) => ({
                url: `users/profile/update/${userId}`,
                method: 'PUT',
                body,
            }),
        }),

        changeUserPassword: builder.mutation({
            query: ({ userId, body }) => ({
                url: `users/changepassword/${userId}`,
                method: 'POST',
                body,
            }),
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
            }),
        }),

        uploadImage: builder.mutation({
            query: (formData) => ({
                url: 'users/profile/upload-image',
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});

export const {
    useLoginUserMutation,
    useGetvalidTokenQuery,
    useGetAllUsersQuery,
    usePatchDataMutation,
    useDeleteDataMutation,
    useLogoutUserMutation,
    useRegisterUserMutation,
    useUpdateUserProfileMutation,
    useChangeUserPasswordMutation,
    useUploadImageMutation,
} = userApi;
