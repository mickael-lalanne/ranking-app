import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../models/User';

// Define a type for the slice state
interface ApplicationState {
    user?: User;
    loading: boolean;
}

// Define the initial state using that type
const initialState: ApplicationState = {
    loading: false
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
        }
    },
});

export const { updateUser, updateLoading } = applicationSlice.actions;

export default applicationSlice.reducer;
