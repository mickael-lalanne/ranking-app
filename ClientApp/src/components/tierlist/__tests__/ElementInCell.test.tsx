import * as React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import ElementInCell, { ElementInCellProps } from '../ElementInCell';

const tierId: string = 'my_tier_id';
const elementId: string = 'my_element_id';
const position: number = 2;

const DEFAULT_PROPS: ElementInCellProps = {
    rankedElements: [{ tierId, elementId, position }],
    tierId,
    position,
    template: {
        id: 'my_template_id',
        name: 'template name',
        tiers: [{ id: tierId, name: 'tier name', rank: 1 }],
        elements: [{ id: elementId, name: 'elt name', image: 'elt image' }],
    },
    readonly: false,
};

const ElementInCellTest = (props: ElementInCellProps) => {
    return (
        <ElementInCell
            rankedElements={props.rankedElements}
            tierId={props.tierId}
            position={props.position}
            template={props.template}
            dropHandler={props.dropHandler}
            readonly={props.readonly}
        />
    );
};

describe('Screenshot', () => {
    it('takes empty cell screenshot', () => {
        const component = renderWithProviders(
            ElementInCellTest({ ...DEFAULT_PROPS, rankedElements: [] })
        );

        expect(component.baseElement).toMatchSnapshot();
    });

    it('takes element in cell screenshot', () => {
        const component = renderWithProviders(ElementInCellTest(DEFAULT_PROPS));

        expect(component.baseElement).toMatchSnapshot();
    });
});

// FYI: d&d behaviors are tested in cypress with e2e tests
