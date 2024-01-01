import * as React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import RankingGrid, { RankingGridProps } from '../RankingGrid';

const rankedEltId1: string = '0';
const rankedEltId2: string = '1';

const DEFAULT_PROPS: RankingGridProps = {
    rankedElements: [
        { tierId: '0', elementId: rankedEltId1, position: 0 },
        { tierId: '2', elementId: rankedEltId2, position: 4 },
    ],
    template: {
        id: 'my_template_id',
        name: 'template name',
        tiers: [
            { id: '0', name: 'tier 0', rank: 0 },
            { id: '1', name: 'tier 1', rank: 1 },
            { id: '2', name: 'tier 2', rank: 2 },
        ],
        elements: [
            { id: rankedEltId1, name: 'ranked-element-1', image: 'ranked-img' },
            { id: rankedEltId2, name: 'ranked-element-2', image: 'ranked-img' },
            { id: 'x', name: 'not-ranked-element', image: 'unranked-img' },
        ],
    },
    readonly: false,
};

const RankingGridTest = (props: RankingGridProps) => {
    return (
        <RankingGrid
            rankedElements={props.rankedElements}
            template={props.template}
            dropHandler={props.dropHandler}
            readonly={props.readonly}
        />
    );
};

describe('Screenshot', () => {
    it('takes default screenshot', () => {
        const component = renderWithProviders(
            RankingGridTest(DEFAULT_PROPS)
        );

        expect(component.baseElement).toMatchSnapshot();
    });
});

// FYI: d&d behaviors are tested in cypress with e2e tests
