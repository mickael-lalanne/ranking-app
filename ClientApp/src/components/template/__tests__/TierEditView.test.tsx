import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../utils/test-utils';
import { screen } from '@testing-library/react';
import TierEditView, { TierEditViewProps } from '../TierEditView';
import { EEditViewMode, Tier } from '../../../models/Template';

const tierSample: Tier = {
    name: 'Tier name 1',
    rank: 0,
};

const DEFAULT_PROPS: TierEditViewProps = {
    createCallback: jest.fn(),
    cancelCallback: jest.fn(),
    editViewMode: EEditViewMode.EditTier,
    existingTiers: [tierSample],
};

const TierEditViewTest = (props: TierEditViewProps) => {
    return (
        <TierEditView
            createCallback={props.createCallback}
            cancelCallback={props.cancelCallback}
            existingTiers={props.existingTiers}
            editViewMode={props.editViewMode}
        />
    );
};

describe('Screenshot', () => {
    it('takes default screenshot', () => {
        const component = renderWithProviders(TierEditViewTest(DEFAULT_PROPS));

        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Common', () => {
    it('creates tier', async () => {
        renderWithProviders(TierEditViewTest(DEFAULT_PROPS));

        // Change the tier name
        const tierName: string = 'My new tier name';
        await userEvent.type(screen.getByLabelText('Tier name'), tierName);

        // Change the tier rank
        const tierRank: number = 2;
        // As an existing tier with rank 0 exists, we should't be able to select the first rank
        expect(screen.getAllByTestId('tier-rank-selector').at(0)).toHaveStyle(
            'pointer-events: none'
        );
        await userEvent.click(
            screen.getAllByTestId('tier-rank-selector').at(tierRank)!
        );

        // Click on the create button
        await userEvent.click(screen.getByTestId('create-tier-button'));
        const createCall: Tier = (DEFAULT_PROPS.createCallback as jest.Mock)
            .mock.calls[0][0];
        expect(createCall.rank).toBe(tierRank);
        expect(createCall.name).toBe(tierName);
    });

    it('cancels tier', async () => {
        renderWithProviders(TierEditViewTest(DEFAULT_PROPS));

        await userEvent.click(screen.getByTestId('cancel-tier-button'));
        expect(DEFAULT_PROPS.cancelCallback).toHaveBeenCalledTimes(1);
    });
});
