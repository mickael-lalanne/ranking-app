import * as React from 'react';
import Home from '../Home';
import { renderWithProviders } from '../../utils/test-utils';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

const clerkPath: string = '@clerk/clerk-react';
const mockSignOutButton = jest.fn(children => children);
jest.mock(clerkPath, () => ({
    ...jest.requireActual(clerkPath),
    useUser: jest.fn(() => {
        return { user: { fullName: 'Bruce Wayne' } };
    }),
    SignOutButton: ({ children }: React.PropsWithChildren<unknown>) => {
        return mockSignOutButton(children);
    },
}));

const HomeTest = () => {
    return (
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    );
};

describe('Screenshot', () => {
    it('takes default screenshot', () => {
        const component = renderWithProviders(HomeTest());

        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Common', () => {
    it('clicks on logout button', async () => {
        renderWithProviders(HomeTest());

        await userEvent.click(screen.getByText('Logout'));
        expect(mockSignOutButton).toHaveBeenCalled();
    });
});


// FYI: Routers tests are made in App.tsx but also in e2e tests with cypress
