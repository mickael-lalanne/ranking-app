import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { templateSlice } from '../store/TemplateStore';
import { tierlistSlice } from '../store/TierlistStore';
import { applicationSlice } from '../store/ApplicationStore';

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
    templates: templateSlice.reducer,
    tierlists: tierlistSlice.reducer,
    application: applicationSlice.reducer
});

export const setupStore  = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState
    });
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;

// Inferred type: {templates: TemplateState}
export type AppStore = ReturnType<typeof setupStore>;

export type AppDispatch = AppStore['dispatch'];
