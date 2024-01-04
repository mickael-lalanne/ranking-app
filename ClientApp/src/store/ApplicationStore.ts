import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface ApplicationState {
    loading: boolean;
    fetchingTemplates: boolean;
    fetchingTierlists: boolean;
}

// Define the initial state using that type
const initialState: ApplicationState = {
    loading: false,
    fetchingTemplates: true,
    fetchingTierlists: true
};

export const applicationSlice = createSlice({
    name: 'applicationSlice',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        updateLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        updateFetchingTemplates: (state, action: PayloadAction<boolean>) => {
            state.fetchingTemplates = action.payload;
        },
        updateFetchingTierlists: (state, action: PayloadAction<boolean>) => {
            state.fetchingTierlists = action.payload;
        }
    },
});

export const { updateLoading, updateFetchingTemplates, updateFetchingTierlists } = applicationSlice.actions;

export default applicationSlice.reducer;
