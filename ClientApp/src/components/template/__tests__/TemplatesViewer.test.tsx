import * as React from 'react';
import {
    ExtendedRenderOptions,
    renderWithProviders,
} from '../../../utils/test-utils';
import { screen } from '@testing-library/react';
import TemplatesViewer from '../TemplatesViewer';
import { Template } from '../../../models/Template';
import userEvent from '@testing-library/user-event';

const editHandler: jest.Mock = jest.fn();
const templateSample: Template = {
    name: 'My template name',
    tiers: [{ name: 'My tier name', rank: 0 }],
    elements: [],
};
const storeWithTemplates: ExtendedRenderOptions = {
    preloadedState: {
        application: {
            fetchingTemplates: false,
            loading: false,
            fetchingTierlists: false,
        },
        templates: { templates: [templateSample] },
    },
};

const TemplatesViewerTest = () => {
    return <TemplatesViewer editHandler={editHandler} />;
};

describe('Screenshot', () => {
    it('takes screenshot when fetching templates', () => {
        const component = renderWithProviders(TemplatesViewerTest());

        expect(component.baseElement).toMatchSnapshot('Fetching templates');
    });

    it('takes screenshot without template', () => {
        const component = renderWithProviders(TemplatesViewerTest(), {
            preloadedState: {
                application: {
                    fetchingTemplates: false,
                    loading: false,
                    fetchingTierlists: false,
                },
            },
        });
        expect(component.baseElement).toMatchSnapshot('Without template');
    });

    it('takes screenshot with templates', () => {
        const component = renderWithProviders(
            TemplatesViewerTest(),
            storeWithTemplates
        );
        expect(component.baseElement).toMatchSnapshot('With templates');
    });
});

describe('Common', () => {
    it('clicks on a template', async () => {
        renderWithProviders(TemplatesViewerTest(), storeWithTemplates);

        await userEvent.click(screen.getByText(templateSample.name));
        expect(editHandler).toHaveBeenCalledWith(templateSample);
    });
});
