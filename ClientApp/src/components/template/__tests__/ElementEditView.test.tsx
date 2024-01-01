import * as React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import { screen } from '@testing-library/react';
import ElementEditView, { ElementEditViewProps } from '../ElementEditView';
import { EEditViewMode } from '../../../models/Template';
import userEvent from '@testing-library/user-event';
import { Element } from '../../../models/Element';

const DEFAULT_PROPS: ElementEditViewProps = {
    createCallback: jest.fn(),
    cancelCallback: jest.fn(),
    editViewMode: EEditViewMode.EditElement,
    defaultImages: [{ source: 'img-source', name: 'img-name' }],
};

const ElementEditViewTest = (props: ElementEditViewProps) => {
    return (
        <ElementEditView
            createCallback={props.createCallback}
            cancelCallback={props.cancelCallback}
            editViewMode={props.editViewMode}
            defaultImages={props.defaultImages}
        />
    );
};

describe('Screenshot', () => {
    it('takes default screenshot', () => {
        const component = renderWithProviders(
            ElementEditViewTest(DEFAULT_PROPS)
        );

        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Common', () => {
    beforeEach(() => {
        (DEFAULT_PROPS.createCallback as jest.Mock).mockClear();
        (DEFAULT_PROPS.cancelCallback as jest.Mock).mockClear();
    });

    it('creates element', async () => {
        renderWithProviders(ElementEditViewTest(DEFAULT_PROPS));

        // Change the element name
        const elementName = 'My element name';
        await userEvent.clear(
            screen.getByDisplayValue(DEFAULT_PROPS.defaultImages[0].name)
        );
        await userEvent.type(
            screen.getByLabelText('Element name'),
            elementName
        );

        // Click on the create button
        await userEvent.click(screen.getByTestId('create-element-button'));
        const createCall: Element[] = (
            DEFAULT_PROPS.createCallback as jest.Mock
        ).mock.calls[0][0];
        expect(createCall[0].image).toBe(DEFAULT_PROPS.defaultImages[0].source);
        expect(createCall[0].name).toBe(elementName);
    });

    it('cancels element', async () => {
        renderWithProviders(ElementEditViewTest(DEFAULT_PROPS));

        await userEvent.click(screen.getByTestId('cancel-element-button'));
        expect(DEFAULT_PROPS.cancelCallback).toHaveBeenCalledTimes(1);
    });
});
