import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../models/User';

// Define a type for the slice state
interface ApplicationState {
    user?: User;
    loading: boolean;
    fetchingTemplates: boolean;
}

// Define the initial state using that type
const initialState: ApplicationState = {
    loading: false,
    fetchingTemplates: true
};

export const applicationSlice = createSlice({
    name: 'applicationSlice',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        updateLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        updateFetchingTemplates: (state, action: PayloadAction<boolean>) => {
            state.fetchingTemplates = action.payload;
        }
    },
});

export const { updateUser, updateLoading, updateFetchingTemplates } = applicationSlice.actions;

export default applicationSlice.reducer;
