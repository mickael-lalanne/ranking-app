import * as React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import ToRankSection, { ToRankSectionProps } from '../ToRankSection';

const tierId: string = 'my_tier_id';
const elementId: string = 'my_element_id';
const position: number = 2;

const DEFAULT_PROPS: ToRankSectionProps = {
    rankedElements: [{ tierId, elementId, position }],
    template: {
        id: 'my_template_id',
        name: 'template name',
        tiers: [{ id: tierId, name: 'tier name', rank: 1 }],
        elements: [{ id: elementId, name: 'elt name', image: 'elt image' }],
    },
    unrankHandler: jest.fn(),
};

const ToRankSectionTest = (props: ToRankSectionProps) => {
    return (
        <ToRankSection
            rankedElements={props.rankedElements}
            template={props.template}
            unrankHandler={props.unrankHandler}
        />
    );
};

describe('Screenshot', () => {
    it('takes empty section screenshot', () => {
        const component = renderWithProviders(ToRankSectionTest(DEFAULT_PROPS));

        expect(component.baseElement).toMatchSnapshot();
    });

    it('takes section with unrank elements screenshot', () => {
        const component = renderWithProviders(
            ToRankSectionTest({ ...DEFAULT_PROPS, rankedElements: [] })
        );

        expect(component.baseElement).toMatchSnapshot();
    });
});

// FYI: d&d behaviors are tested in cypress with e2e tests
