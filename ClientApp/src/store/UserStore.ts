import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../models/User';

// Define a type for the slice state
interface UserState {
    user?: User;
}

// Define the initial state using that type
const initialState: UserState = {
};

export const userSlice = createSlice({
    name: 'userSlice',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        }
    },
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
