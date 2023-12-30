import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '../app/store';
import type { AppStore, RootState } from '../app/store';
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles';
import '@testing-library/jest-dom';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
export interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>;
    store?: AppStore;
}

// Mock MUI theme
const RANKING_APP_THEME_MOCK: ThemeOptions = {
    defaultRankingTheme: {
        primary: '',
        primaryLight: '',
        light: '',
        dark: '',
        info: '',
    },
};
const MockTheme = ({ children }: any) => {
    const theme = createTheme(RANKING_APP_THEME_MOCK);
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState = {},
        // Automatically create a store instance if no store was passed in
        store = setupStore(preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
        return (
            <MockTheme>
                <Provider store={store}>
                    <DndProvider
                        backend={TouchBackend}
                        options={{ enableMouseEvents: true }}
                    >
                        {children}
                    </DndProvider>
                </Provider>
            </MockTheme>
        );
    }

    // Return an object with the store and all of RTL's query functions
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
