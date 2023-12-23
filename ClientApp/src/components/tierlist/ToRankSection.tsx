import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { Template } from '../../models/Template';
import { Element, RankedElement } from '../../models/Element';
import ElementPreview from '../shared/ElementPreview';
import { useDrop } from 'react-dnd';
import { ETierlistDragItem } from '../../models/Tierlist';
import { ELEMENT_SIZE } from '../../utils/css-utils';

const ToRankSection = ({ template, rankedElements, unrankHandler }: {
    template?: Template,
    rankedElements: RankedElement[],
    unrankHandler: (elementId: string) => void
}) => {
    const [notRankedElements, setNotRankedElements] = useState<Element[]>([]);

    // If user drop a ranked element in the "to rank section", unrank it
    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: ETierlistDragItem.Element,
            drop: (item: Element) => {
                unrankHandler(item.id!);
            },
            canDrop: (item: Element) => {
                // Only the ranked elements can be dropped in the unrank area
                return !!rankedElements.find(elt => elt.elementId === item.id);
            },
            collect: monitor => ({
                isOver: !!monitor.isOver(),
                canDrop: monitor.canDrop()
            }),
        }),
        [notRankedElements, rankedElements]
    );

    /**
     * Called when the selected template has changed or when a element has been ranked
     * Determine all not ranked elements
     */
    useEffect(() => {
        if (template) {
            const notRankedElements = template.elements.filter(
                templateElt => rankedElements.findIndex(rankedElt => rankedElt.elementId === templateElt.id) === -1
            );
            setNotRankedElements(notRankedElements);
        }
    }, [template, rankedElements]);

    const ElementsList = (): React.JSX.Element[] => {
        const list: React.JSX.Element[] = [];

        notRankedElements.forEach(element => {
            list.push(
                <div key={element.id} style={{ margin: ELEMENTS_MARGIN + 'px' }}>
                    <ElementPreview element={element}/>
                </div>
            );
        });

        return list;
    };

    const UnrankDropZone = (): React.JSX.Element | false => {
        return canDrop && <div
            style={{ backgroundColor: isOver ? 'yellow' : 'white'}}
            className={unrank_zone_style}
        >
            Unrank element
        </div>;
    };

    return(<>
        <div ref={drop} className={section_container_style}>
            {UnrankDropZone()}
            {ElementsList()}
        </div>
    </>);
};

export default ToRankSection;

/**
 * CSS STYLES
 */
const ELEMENTS_MARGIN: number = 2;
const section_container_style = css({
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    margin: '20px 0',
    flexWrap: 'wrap',
    minHeight: parseFloat(ELEMENT_SIZE) + ELEMENTS_MARGIN * 2 + 'px',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
});

const unrank_zone_style = css({
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 1,
    opacity: 0.80,
    border: '2px solid black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});
