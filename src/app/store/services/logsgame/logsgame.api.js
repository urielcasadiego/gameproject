import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const logApi = createApi({
    reducerPath: 'logApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL_USERS,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllLogs: builder.query({
            query: ({ page, limit }) => ({
                url: `logs/admin?page=${page}&limit=${limit}`,
                method: 'GET',
            }),
        }),
        registerLog: builder.mutation({
            query: (body) => ({
                url: 'logs/register',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useGetAllLogsQuery, useRegisterLogMutation } = logApi;
