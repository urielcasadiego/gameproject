import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const scoreApi = createApi({
    reducerPath: 'scoreApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL_SCORES,
        prepareHeaders: (headers, { getState, endpoint }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllScoresName: builder.query({
            query: ({ page, limit }) => ({
                url: `scores/findName?page=${page}&limit=${limit}`,
                method: 'GET',
            }),
            transformResponse: (response) => {
                return {
                    data: response.data,
                    code: response.code,
                    message: response.message,
                    totalEntries: response.totalDocs,
                    totalPages: response.totalPages,
                    currentPage: response.page,
                };
            },
        }),

        getAllScoresTop20: builder.query({
            query: () => ({
                url: `scores/top`,
                method: 'GET',
            }),
        }),

        registerScore: builder.mutation({
            query: (body) => ({
                url: 'scores/create',
                method: 'POST',
                body,
            }),
        }),

        deleteScore: builder.mutation({
            query: ({ scoreId, data }) => ({
                url: `scores/delete/${scoreId}`,
                method: 'DELETE',
                body: data,
            }),
        }),
    }),
});

export const {
    useDeleteScoreMutation,
    useGetAllScoresNameQuery,
    useRegisterScoreMutation,
    useGetAllScoresTop20Query,
} = scoreApi;
