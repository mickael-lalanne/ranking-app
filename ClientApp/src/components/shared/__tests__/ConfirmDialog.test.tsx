import * as React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import { screen } from '@testing-library/react';
import ConfirmDialog, { ConfirmDialogTypes } from '../ConfirmDialog';
import userEvent from '@testing-library/user-event';

const DEFAULT_PROPS: ConfirmDialogTypes = {
    title: 'My title',
    content: 'My content',
    open: true,
    cancelHandler: jest.fn(),
    confirmHandler: jest.fn(),
};
const textValidation: string = 'My text validation';

const ConfirmDialogTest = (props: ConfirmDialogTypes) => {
    return (
        <ConfirmDialog
            title={props.title}
            content={props.content}
            confirmHandler={props.confirmHandler}
            cancelHandler={props.cancelHandler}
            open={props.open}
            textValidation={props.textValidation}
        />
    );
};

describe('Screenshot', () => {
    it('takes screenshot in open state', () => {
        const component = renderWithProviders(ConfirmDialogTest(DEFAULT_PROPS));

        expect(component.baseElement).toMatchSnapshot('Open dialog');
    });

    it('takes screenshot in close state', () => {
        const component = renderWithProviders(
            ConfirmDialogTest({ ...DEFAULT_PROPS, open: false })
        );

        expect(component.baseElement).toMatchSnapshot('Close dialog');
    });
});

describe('Common', () => {
    it('validates confirm and cancel handlers', async () => {
        renderWithProviders(ConfirmDialogTest(DEFAULT_PROPS));

        // Click on the cancel button
        await userEvent.click(screen.getByText('Cancel'));
        expect(DEFAULT_PROPS.cancelHandler).toHaveBeenCalledTimes(1);
        // Click on the confirm button
        await userEvent.click(screen.getByText('Confirm'));
        expect(DEFAULT_PROPS.confirmHandler).toHaveBeenCalledTimes(1);
    });

    it('tests the text validator', async () => {
        renderWithProviders(
            ConfirmDialogTest({ ...DEFAULT_PROPS, textValidation })
        );

        // Type a different text than expected
        await userEvent.type(
            screen.getByPlaceholderText(textValidation),
            'a random text'
        );
        // The confirm button should be disabled
        expect(screen.getByText('Confirm').closest('button')?.disabled).toBe(
            true
        );

        // Type the text expected
        await userEvent.clear(screen.getByPlaceholderText(textValidation));
        await userEvent.type(
            screen.getByPlaceholderText(textValidation),
            textValidation
        );
        // Now, the confirm button should be enable
        expect(screen.getByText('Confirm').closest('button')?.disabled).toBe(
            false
        );
    });
});
