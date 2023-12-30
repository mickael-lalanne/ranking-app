import * as React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import ElementPreview, { ElementPreviewProps } from '../ElementPreview';
import { Element } from '../../../models/Element';
import userEvent from '@testing-library/user-event';

const elementSample: Element = {
    id: 'element id',
    name: 'element name',
    image: 'element image',
};

const DEFAULT_PROPS: ElementPreviewProps = {
    element: elementSample,
};

const ElementPreviewTest = (props: ElementPreviewProps) => {
    return (
        <ElementPreview
            element={props.element}
            deleteElementHandler={props.deleteElementHandler}
            readonly={props.readonly}
            fitToContainer={props.fitToContainer}
        />
    );
};

describe('Screenshot', () => {
    it('takes default screenshot', () => {
        const component = renderWithProviders(
            ElementPreviewTest(DEFAULT_PROPS)
        );

        expect(component.baseElement).toMatchSnapshot();
    });

    it('takes screenshot with delete button', async () => {
        const component = renderWithProviders(
            ElementPreviewTest({
                ...DEFAULT_PROPS,
                deleteElementHandler: jest.fn(),
            })
        );

        // Hover the element preview
        await userEvent.hover(screen.getByTestId('element-preview'));

        expect(component.baseElement).toMatchSnapshot('With delete button');
    });
});

describe('Common', () => {
    it('deletes element', async () => {
        const deleteMock: jest.Mock = jest.fn();
        renderWithProviders(
            ElementPreviewTest({
                element: elementSample,
                deleteElementHandler: deleteMock,
            })
        );

        // The delete button should not be displayed
        expect(screen.queryByTestId('delete-element')).toBe(null);

        // Hover the element preview
        await userEvent.hover(screen.getByTestId('element-preview'));

        // With the delete button now displayed, click on it
        await userEvent.click(screen.getByTestId('RemoveCircleOutlineIcon'));
        expect(deleteMock).toHaveBeenCalledWith(elementSample.id);
    });
});

