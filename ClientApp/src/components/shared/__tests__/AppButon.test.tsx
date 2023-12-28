import * as React from 'react';
import AppButton, { AppButtonProps } from '../AppButton';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../utils/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import CancelIcon from '@mui/icons-material/Cancel';
import { act } from 'react-dom/test-utils';
import { EResponsiveBreakpoints } from '../../../utils/css-utils';

const DEFAULT_PROPS: AppButtonProps = {
    onClickHandler: jest.fn(),
    text: 'My Button text',
};
const AppButtonTest = (props: AppButtonProps) => {
    return (
        <AppButton
            text={props.text}
            onClickHandler={props.onClickHandler}
            disabled={props.disabled}
            icon={props.icon}
        />
    );
};

describe('Screenshot', () => {
    it('Takes default screenshot', () => {
        const component = renderWithProviders(AppButtonTest(DEFAULT_PROPS));

        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Common', () => {
    it('Clicks on the button', async () => {
        renderWithProviders(AppButtonTest(DEFAULT_PROPS));

        expect(DEFAULT_PROPS.onClickHandler).toHaveBeenCalledTimes(0);
        await userEvent.click(screen.getByText(DEFAULT_PROPS.text));
        expect(DEFAULT_PROPS.onClickHandler).toHaveBeenCalledTimes(1);
    });

    it('checks if disable', () => {
        // By default, the button is enable
        const { rerender } = renderWithProviders(AppButtonTest(DEFAULT_PROPS));
        expect(
            screen.getByText(DEFAULT_PROPS.text).closest('button')
        ).toBeEnabled();

        // Change the disabled props to check if the button is now disabled
        rerender(AppButtonTest({ ...DEFAULT_PROPS, disabled: true }));
        expect(
            screen.getByText(DEFAULT_PROPS.text).closest('button')
        ).toBeDisabled();
    });
});

describe('Responsive', () => {
    it('displays the text', () => {
        renderWithProviders(
            AppButtonTest({ ...DEFAULT_PROPS, icon: <CancelIcon /> })
        );

        expect(screen.getByText(DEFAULT_PROPS.text)).toBeDefined();
    });

    it('displays the icon', async () => {
        renderWithProviders(
            AppButtonTest({ ...DEFAULT_PROPS, icon: <CancelIcon /> })
        );

        // Change the windows size to have a small screen
        await act(async () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                // In jest environment, the size will not be converted in px
                // So we can use directly the em value
                value: parseFloat(EResponsiveBreakpoints.sm),
            });
            await fireEvent(window, new Event('resize'));
        });

        // Now, the text button should not be displayed
        expect(await screen.queryByText(DEFAULT_PROPS.text)).toBeNull();
        // The icon should be displayed instead
        expect(await screen.findByTestId('app-btn-icon')).toBeDefined();
    });
});
