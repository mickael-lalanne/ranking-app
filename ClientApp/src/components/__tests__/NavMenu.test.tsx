import * as React from 'react';
import NavMenu from '../NavMenu';
import { renderWithProviders } from '../../utils/test-utils';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

const clerkPath: string = '@clerk/clerk-react';
const mockSignOutButton = jest.fn(children => children);
jest.mock(clerkPath, () => ({
    ...jest.requireActual(clerkPath),
    SignOutButton: ({ children }: React.PropsWithChildren<unknown>) => {
        return mockSignOutButton(children);
    },
}));

const NavMenuTest = () => {
    return (
        <MemoryRouter>
            <NavMenu height='60' />
        </MemoryRouter>
    );
};

describe('Screenshot', () => {
    it('takes default screenshot', () => {
        const component = renderWithProviders(NavMenuTest());

        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Common', () => {
    it('clicks on logout button', async () => {
        renderWithProviders(NavMenuTest());

        await userEvent.click(screen.getByText('Logout'));
        expect(mockSignOutButton).toHaveBeenCalled();
    });
});

// FYI: Routers tests are made in App.tsx but also in e2e tests with cypress
