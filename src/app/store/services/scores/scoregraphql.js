import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const scoregraphqlApi = createApi({
    reducerPath: 'scoregrapApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3005/api/v1/',
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
        getAllScoresTopNameGraphql: builder.query({
            query: () => ({
                url: 'graphql',
                method: 'POST',
                body: {
                    query: `
                query getAllScoresTop {
                    getAllScoresTop {
                        code
                        message
                        data {
                            name
                            score
                            game
                            createdAt
                        }
                    }
                }
            `,
                },
            }),
            transformResponse: (response) => ({
                data: response.data.getAllScoresTop.data,
                code: response.data.getAllScoresTop.code,
                message: response.data.getAllScoresTop.message,
            }),
        }),

        getAllScoresNameGraphql: builder.query({
            query: ({ page, limit }) => ({
                url: 'graphql',
                method: 'POST',
                body: {
                    query: `
                    query getAllScores($page: Int, $limit: Int) {
                        getAllScores(page: $page, limit: $limit) {
                            code
                            message
                            data {
                                name
                                score
                                game
                                createdAt
                            }
                            totalDocs
                            totalPages
                            page
                        }
                    }
                `,
                    variables: { page, limit },
                },
            }),
            transformResponse: (response) => ({
                data: response.data.getAllScores.data,
                code: response.data.getAllScores.code,
                message: response.data.getAllScores.message,
                totalEntries: response.data.getAllScores.totalDocs,
                totalPages: response.data.getAllScores.totalPages,
                currentPage: response.data.getAllScores.page,
            }),
        }),
    }),
});

export const {
    useGetAllScoresNameGraphqlQuery,
    useGetAllScoresTopNameGraphqlQuery,
} = scoregraphqlApi;
