import * as React from 'react';
import {
    ExtendedRenderOptions,
    renderWithProviders,
} from '../../../utils/test-utils';
import TierlistsEditor, {
    NO_TEMPLATE_SELECTED_MESSAGE,
} from '../TierlistsEditor';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ERankingLayoutMode, RankingType } from '../../../models/RankingLayout';
import { Tier } from '../../../models/Template';
import { Element } from '../../../models/Element';

const saveHandler: jest.Mock = jest.fn();

const TierlistsEditorTest = (
    mode: ERankingLayoutMode = ERankingLayoutMode.Builder,
    itemToEdit?: RankingType
) => {
    return (
        <TierlistsEditor
            saveHandler={saveHandler}
            mode={mode}
            itemToEdit={itemToEdit}
        />
    );
};

const templateName: string = 'My template name';
const userId: string = 'user-id';
const templateId: string = 'template-id';
const tiers: Tier[] = [
    { id: '0', name: 'Tier 1', rank: 0 },
    { id: '1', name: 'Tier 1', rank: 1 },
    { id: '2', name: 'Tier 1', rank: 2 },
];
const elements: Element[] = [
    { id: '0', name: 'Elt 1', image: 'img-1' },
    { id: '1', name: 'Elt 2', image: 'img-2' },
    { id: '2', name: 'Elt 3', image: 'img-3' },
];

const storeWithData: ExtendedRenderOptions = {
    preloadedState: {
        application: {
            fetchingTemplates: false,
            loading: false,
            fetchingTierlists: false,
            user: { id: userId },
        },
        templates: {
            templates: [
                {
                    id: templateId,
                    name: templateName,
                    elements,
                    tiers,
                },
            ],
        },
    },
};

describe('Screenshot', () => {
    it('takes builder screenshot', () => {
        const component = renderWithProviders(
            TierlistsEditorTest(),
            storeWithData
        );

        expect(component.baseElement).toMatchSnapshot();
    });

    it('takes editor screenshot', () => {
        const component = renderWithProviders(
            TierlistsEditorTest(ERankingLayoutMode.Editor, {
                id: 'tierlist-id',
                name: 'Tierlist to edit name',
                rankedElements: [
                    {
                        elementId: elements[0].id!,
                        tierId: tiers[0].id!,
                        position: 0,
                    },
                    {
                        elementId: elements[1].id!,
                        tierId: tiers[1].id!,
                        position: 2,
                    },
                    {
                        elementId: elements[2].id!,
                        tierId: tiers[2].id!,
                        position: 4,
                    },
                ],
                templateId,
                userId,
                createdAt: '',
            }),
            storeWithData
        );

        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Common', () => {
    beforeEach(() => {});

    it('saves a tierlist', async () => {
        renderWithProviders(TierlistsEditorTest(), storeWithData);

        // The save button should be disable
        expect(
            screen.getByText('Create tierlist').closest('button')?.disabled
        ).toBe(true);

        // No template is selected yet, so an info box should be displayed
        expect(screen.getByText(NO_TEMPLATE_SELECTED_MESSAGE)).toBeDefined();

        // Select a template
        await userEvent.click(screen.getByLabelText('Template'));
        await userEvent.click(screen.getByText(templateName));

        // Now, the ranking grid and the to rank section should be displayed
        expect(screen.getByTestId('to-rank-section')).toBeDefined();
        expect(screen.getByTestId('ranking-grid')).toBeDefined();

        // Set a name
        const tierlistName: string = 'My tierlist name';
        await userEvent.type(screen.getByLabelText('Name'), tierlistName);

        // Now that a template has been selected and a name setted, the save button should be enable
        expect(
            screen.getByText('Create tierlist').closest('button')?.disabled
        ).toBe(false);
        await userEvent.click(screen.getByText('Create tierlist'));
        expect(saveHandler).toHaveBeenCalledWith({
            name: tierlistName,
            rankedElements: [],
            templateId,
            userId,
        });
    });
});
