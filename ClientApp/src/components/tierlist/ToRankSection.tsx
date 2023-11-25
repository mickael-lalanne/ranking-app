import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { Template } from '../../models/Template';
import { Element, RankedElement } from '../../models/Element';
import ElementPreview from '../shared/ElementPreview';

const ToRankSection = ({ template, rankedElements, dragStartHandler, dragEndHandler }: {
    template?: Template,
    rankedElements: RankedElement[],
    dragStartHandler: (element: Element) => void,
    dragEndHandler: () => void,
}) => {
    const [notRankedElements, setNotRankedElements] = useState<Element[]>([]);

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
                <div className={element_preview_style}>
                    <ElementPreview
                        element={element}
                        dragStartHandler={dragStartHandler}
                        dragEndHandler={dragEndHandler}
                    />
                </div>
            );
        });

        return list;
    };

    return(<>
        <div className={section_container_style}>
            {ElementsList()}
        </div>
    </>);
};

export default ToRankSection;

/**
 * CSS STYLES
 */
const section_container_style = css({
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
    height: '75px'
});

const element_preview_style = css({
    margin: '0 20px',
    aspectRatio: '1 / 1'
});
