import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tierlist } from '../models/Tierlist';
import { sortByCreationDate } from '../services/Util';
import { RootState } from '../app/store';

// Define a type for the slice state
interface TierlistState {
    tierlists: Tierlist[];
}

// Define the initial state using that type
const initialState: TierlistState = {
    tierlists: [],
};

export const tierlistSlice = createSlice({
    name: 'tierlistSlice',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        init: (state, action: PayloadAction<Tierlist[]>) => {
            state.tierlists = action.payload;
        },
        addTierlist: (state, action: PayloadAction<Tierlist>) => {
            state.tierlists = state.tierlists.concat(action.payload);
        },
        removeTierlist: (state, action: PayloadAction<string>) => {
            const tierlistsCopy: Tierlist[] = state.tierlists.slice();
            state.tierlists = tierlistsCopy.filter(tierlist => tierlist.id !== action.payload);
        },
        updateTierlist: (state, action: PayloadAction<Tierlist>) => {
            const tierlistsCopy: Tierlist[] = state.tierlists.slice();

            let tierlistToUpdateIndex: number = tierlistsCopy.findIndex(
                tierlist => tierlist.id === action.payload.id
            );

            if (tierlistToUpdateIndex !== -1) {
                tierlistsCopy[tierlistToUpdateIndex] = action.payload;
                state.tierlists = tierlistsCopy;
            }
        }
    },
});

export const { init, addTierlist, removeTierlist, updateTierlist } = tierlistSlice.actions;

export default tierlistSlice.reducer;

// SELECTORS

// Return templates sorted by creation date
export const sortedTierlistsSelector = createSelector(
    [(state: RootState) => state.tierlists],
    tierlists => sortByCreationDate(tierlists.tierlists) as Tierlist[]
);
