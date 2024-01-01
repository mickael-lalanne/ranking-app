import * as React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import App from '../App';
import { MemoryRouter, Route, Router, Routes } from 'react-router-dom';
import { MemoryHistory, createMemoryHistory } from 'history';
import { ERankingAppRoutes } from '../AppRoutes';

const clerkPath: string = '@clerk/clerk-react';
jest.mock(clerkPath, () => ({
    ...jest.requireActual(clerkPath),
    useUser: jest.fn(() => {
        return { user: { fullName: 'Bruce Wayne' } };
    }),
    SignOutButton: () => <></>,
    SignedIn: ({ children }: React.PropsWithChildren<unknown>) => {
        return children;
    },
}));

const AppTest = (history: MemoryHistory) => {
    return (
        <Router location={history.location} navigator={history}>
            <App />
        </Router>
    );
};

describe('Screenshot', () => {
    it('takes default screenshot', async () => {
        const history = createMemoryHistory();
        history.push('/');
        const component = renderWithProviders(AppTest(history));

        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Common', () => {
    it('go to template page', async () => {
        const history = createMemoryHistory();
        history.push(ERankingAppRoutes.templates);

        renderWithProviders(AppTest(history));

        expect(screen.findByTestId('templates-viewer')).toBeDefined();
    });

    it('go to tierlist page', async () => {
        const history = createMemoryHistory();
        history.push(ERankingAppRoutes.tierlists);

        renderWithProviders(AppTest(history));

        expect(screen.findByTestId('tierlists-viewer')).toBeDefined();
    });
});
