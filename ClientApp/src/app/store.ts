import { configureStore } from '@reduxjs/toolkit';
import { templateSlice } from '../store/TemplateStore';
import { tierlistSlice } from '../store/TierlistStore';

const store = configureStore({
    reducer: {
        templates: templateSlice.reducer,
        tierlists: tierlistSlice.reducer
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {templates: TemplateState}
export type AppDispatch = typeof store.dispatch;

export default store;
