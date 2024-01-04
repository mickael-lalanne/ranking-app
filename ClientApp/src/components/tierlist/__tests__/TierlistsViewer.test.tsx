import * as React from 'react';
import {
    ExtendedRenderOptions,
    renderWithProviders,
} from '../../../utils/test-utils';
import { screen } from '@testing-library/react';
import TierlistsViewer from '../TierlistsViewer';
import { Template } from '../../../models/Template';
import userEvent from '@testing-library/user-event';
import { Tierlist } from '../../../models/Tierlist';

const editHandler: jest.Mock = jest.fn();
const templateSample: Template = {
    id: '0',
    name: 'My template name',
    tiers: [{ name: 'My tier name', rank: 0 }],
    elements: [],
};
const tierlistSample: Tierlist = {
    id: '0',
    name: 'My tierlist name',
    rankedElements: [],
    templateId: templateSample.id!,
    createdAt: ''
}
const storeWithData: ExtendedRenderOptions = {
    preloadedState: {
        application: {
            fetchingTemplates: false,
            loading: false,
            fetchingTierlists: false,
        },
        templates: { templates: [templateSample] },
        tierlists: { tierlists: [tierlistSample] }
    },
};

const TierlistsViewerTest = () => {
    return <TierlistsViewer editHandler={editHandler} />;
};

describe('Screenshot', () => {
    it('takes screenshot when fetching tierlists', () => {
        const component = renderWithProviders(TierlistsViewerTest());

        expect(component.baseElement).toMatchSnapshot('Fetching tierlists');
    });

    it('takes screenshot without tierlist', () => {
        const component = renderWithProviders(TierlistsViewerTest(), {
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

    it('takes screenshot with tierlists', () => {
        const component = renderWithProviders(
            TierlistsViewerTest(),
            storeWithData
        );
        expect(component.baseElement).toMatchSnapshot('With tierlists');
    });
});

describe('Common', () => {
    it('clicks on a tierlist', async () => {
        renderWithProviders(TierlistsViewerTest(), storeWithData);

        await userEvent.click(screen.getByText(tierlistSample.name));
        expect(editHandler).toHaveBeenCalledWith(tierlistSample);
    });
});
