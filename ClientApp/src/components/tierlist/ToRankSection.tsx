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
                <ElementPreview
                    key={element.id}
                    element={element}
                    dragStartHandler={dragStartHandler}
                    dragEndHandler={dragEndHandler}
                />
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
    justifyContent: 'flex-start',
    margin: '20px 0',
    flexWrap: 'wrap'
});
