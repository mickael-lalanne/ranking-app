import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../utils/test-utils';
import { screen } from '@testing-library/react';
import AddElementButton from '../AddElementButton';

const changeCallback = jest.fn();

const AddElementButtonTest = () => {
    return <AddElementButton changeCallback={changeCallback} />;
};

describe('Screenshot', () => {
    it('Takes default screenshot', () => {
        const component = renderWithProviders(AddElementButtonTest());

        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Common', () => {
    beforeEach(() => {
        changeCallback.mockClear();
    })

    it('uploads an element with image', async () => {
        renderWithProviders(AddElementButtonTest());

        const file = new File(['element'], 'elt.png', {type: 'image/png'})
    
        expect(changeCallback).toHaveBeenCalledTimes(0);
        await userEvent.upload(screen.getByTestId('add-element-input'), file);
        // An image is accepted, the change callback should have been called
        expect(changeCallback).toHaveBeenCalledTimes(1);
    });

    it('uploads an element with image', async () => {
        renderWithProviders(AddElementButtonTest());

        const file = new File(['element'], 'elt.mp4', {type: 'video/mp4'})
    
        expect(changeCallback).toHaveBeenCalledTimes(0);
        await userEvent.upload(screen.getByTestId('add-element-input'), file);
        // A video is not accepted, the change callback should not have been called
        expect(changeCallback).toHaveBeenCalledTimes(0);
    });
});
