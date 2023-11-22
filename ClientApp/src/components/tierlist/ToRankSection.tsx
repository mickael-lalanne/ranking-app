import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { Template } from '../../models/Template';
import { Element, RankedElement } from '../../models/Element';
import ElementPreview from '../shared/ElementPreview';

const ToRankSection = ({ template, rankedElements }: {
    template?: Template,
    rankedElements: RankedElement[]
}) => {
    const [notRankedElements, setNotRankedElements] = useState<Element[]>([]);

    /**
     * Called when the selected template has changed
     * Determine all not ranked elements
     */
    useEffect(() => {
        if (template) {
            const notRankedElements = template.elements.filter(
                templateElt => rankedElements.findIndex(rankedElt => rankedElt.elementId === templateElt.id) === -1
            );
            setNotRankedElements(notRankedElements);
        }
    }, [template]);

    const ElementsList = (): React.JSX.Element[] => {
        const list: React.JSX.Element[] = [];

        notRankedElements.forEach(element => {
            list.push(
                <ElementPreview element={element} />
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
    margin: '20px 0'
});
