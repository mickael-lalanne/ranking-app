import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Template } from '../models/Template';

// Define a type for the slice state
interface TemplateState {
    templates: Template[];
}

// Define the initial state using that type
const initialState: TemplateState = {
    templates: [],
};

export const templateSlice = createSlice({
    name: 'templateSlice',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        init: (state, action: PayloadAction<Template[]>) => {
            state.templates = action.payload;
        },
        addTemplate: (state, action: PayloadAction<Template>) => {
            state.templates = state.templates.concat(action.payload);
        },
        removeTemplate: (state, action: PayloadAction<string>) => {
            const templatesCopy: Template[] = state.templates.slice();
            state.templates = templatesCopy.filter(template => template.id !== action.payload);
        },
        updateTemplate: (state, action: PayloadAction<Template>) => {
            const templatesCopy: Template[] = state.templates.slice();

            let templateToUpdateIndex: number = templatesCopy.findIndex(
                template => template.id === action.payload.id
            );

            if (templateToUpdateIndex !== -1) {
                templatesCopy[templateToUpdateIndex] = action.payload;
                state.templates = templatesCopy;
            }
        }
    },
});

export const { init, addTemplate, removeTemplate, updateTemplate } = templateSlice.actions;

export default templateSlice.reducer;
