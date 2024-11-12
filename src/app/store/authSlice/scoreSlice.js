import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const scoresSlice = createSlice({
    name: 'scores',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteScore.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteScore.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.filter(
                    (score) => score.id !== action.payload,
                );
            })
            .addCase(deleteScore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default scoresSlice.reducer;
