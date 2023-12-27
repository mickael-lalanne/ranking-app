import React from 'react';
import { css } from '@emotion/css';
import { Element, RankedElement } from '../../models/Element';
import { Template } from '../../models/Template';
import ElementPreview from '../shared/ElementPreview';
import { useDrop } from 'react-dnd';
import { ETierlistDragItem } from '../../models/Tierlist';

const ElementInCell = (
    { rankedElements, tierId, position, template, dropHandler, readonly } : {
        rankedElements: RankedElement[];
        tierId: string,
        position: number,
        template: Template,
        dropHandler?: (draggedElement: Element, tierId: string, rank: number) => void,
        readonly: boolean
    }
) => {
    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: ETierlistDragItem.Element,
            drop: item => {
                dropHandler && dropHandler(item as Element, tierId, position);
            },
            collect: monitor => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        [rankedElements]
    );

    const CellDropOver =  (): React.JSX.Element | false => {
        return isOver && <div className={drag_over_style} />;
    };

    const CellContent = (): React.JSX.Element | undefined => {
        const elementInCell: RankedElement | undefined = rankedElements.find(
            rankedElt => rankedElt.tierId === tierId && rankedElt.position === position
        );
    
        const elementObject: Element | undefined = template?.elements.find(
            elt => elt.id === elementInCell?.elementId
        );

        return elementInCell && elementObject && <>
            <ElementPreview
                element={elementObject}
                readonly={readonly}
                fitToContainer
            />
        </>;
    };

    return (
        <div ref={drop} className={tier_cell_style} data-cy="element-in-cell">
            {CellContent()}
            {CellDropOver()}
        </div>
    );
};

export default ElementInCell;

/**
 * CSS STYLES
 */
const tier_cell_style = css({
    width: '20%',
    aspectRatio: '1 / 1',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
});

const drag_over_style = css({
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 1,
    opacity: 0.5,
    backgroundColor: 'white',
});
