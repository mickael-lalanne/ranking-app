import * as React from 'react';
import TemplateEditor, { DEFAULT_TIERS } from '../TemplateEditor';
import { ERankingLayoutMode, RankingType } from '../../../models/RankingLayout';
import {
    ExtendedRenderOptions,
    renderWithProviders,
} from '../../../utils/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResizedImage } from '../../../utils/Util';
// import { uploadElementsImages } from '../../../services/CloudinaryService';
import { Element } from '../../../models/Element';
import { Template } from '../../../models/Template';

const saveHandler: jest.Mock = jest.fn();

const TemplatesEditorTest = (
    mode: ERankingLayoutMode = ERankingLayoutMode.Builder,
    itemToEdit?: RankingType
) => {
    return (
        <TemplateEditor
            saveHandler={saveHandler}
            mode={mode}
            itemToEdit={itemToEdit}
        />
    );
};
const storeWithoutLoading: ExtendedRenderOptions = {
    preloadedState: {
        application: {
            fetchingTemplates: false,
            loading: false,
            fetchingTierlists: false,
        },
    },
};

// Mock the resize image function from Util.tsx file
// Otherwise we cannot add element and test the save template behavior
const utilsPath: string = '../../../utils/Util.tsx';
jest.mock(utilsPath, () => ({
    ...jest.requireActual(utilsPath),
    resizeImage: jest.fn(
        (imgFile: File) =>
            new Promise<ResizedImage>((resolve) => {
                resolve({
                    source: imgFile.name + '-source',
                    name: imgFile.name,
                });
            })
    ),
}));

// Mock the server calls from the cloudinary service when saving a template
const cloudinaryServicePath = '../../../services/CloudinaryService';
jest.mock(cloudinaryServicePath, () => ({
    ...jest.requireActual(cloudinaryServicePath),
    uploadElementsImages: jest.fn(
        (elements: Element[]) =>
            new Promise<Element[]>((resolve) => {
                resolve(elements);
            })
    ),
}));

describe('Screenshot', () => {
    it('Takes builder screenshot', () => {
        const component = renderWithProviders(
            TemplatesEditorTest(),
            storeWithoutLoading
        );

        expect(component.baseElement).toMatchSnapshot();
    });

    it('Takes editor screenshot', () => {
        const templateToEdit: Template = {
            name: 'Template for Editor',
            tiers: [{ name: 'My tier for editor', rank: 3, id: '0' }],
            elements: [
                { id: '0', name: 'editor-elt-1', image: 'editor-elt-img-1' },
                { id: '1', name: 'editor-elt-2', image: 'editor-elt-img-2' },
                { id: '2', name: 'editor-elt-3', image: 'editor-elt-img-3' },
            ],
        };
        const component = renderWithProviders(
            TemplatesEditorTest(ERankingLayoutMode.Editor, templateToEdit),
            storeWithoutLoading
        );

        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Builder', () => {
    beforeEach(() => {});

    it('saves a template', async () => {
        renderWithProviders(TemplatesEditorTest(), storeWithoutLoading);

        // The save button should be disable
        expect(
            screen.getByText('Create template').closest('button')?.disabled
        ).toBe(true);

        // Set a name
        const templateName: string = 'My template name';
        await userEvent.type(screen.getByLabelText('Name'), templateName);

        // By default, 5 tiers should have been created
        expect(
            await screen.findAllByTestId('template-tier-in-editor')
        ).toHaveLength(5);
        // So the add tier button should not be displayed
        expect(screen.queryByTestId('template-editor-add-tier-button')).toBe(
            null
        );

        // Add an element
        const elementName: string = 'elt.png';
        const file = new File(['element'], 'elt.png', { type: 'image/png' });
        await userEvent.upload(screen.getByTestId('add-element-input'), file);
        await userEvent.click(screen.getByTestId('create-element-button'));

        // Now that a name has been setted and an element added, the save button should be enable
        expect(
            screen.getByText('Create template').closest('button')?.disabled
        ).toBe(false);
        await userEvent.click(screen.getByText('Create template'));
        const saveCall: Template = saveHandler.mock.calls[0][0];
        expect(saveCall.elements).toHaveLength(1);
        expect(saveCall.elements[0].name).toBe(elementName);
        expect(saveCall.elements[0].image).toBe(elementName + '-source');
        expect(saveCall.tiers).toBe(DEFAULT_TIERS);
        expect(saveCall.name).toBe(templateName);
    });
});
