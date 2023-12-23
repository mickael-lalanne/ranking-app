import React from 'react';
import { css } from '@emotion/css';
import { TIERS_COLORS, Template } from '../../models/Template';
import { RankedElement, Element } from '../../models/Element';
import ElementInCell from './ElementInCell';

const RankingGrid = ({ template, dropHandler, rankedElements, readonly = false, innerRef }: {
    template?: Template,
    rankedElements: RankedElement[],
    dropHandler?: (draggedElement: Element, tierId: string, rank: number) => void,
    readonly?: boolean,
    innerRef?: React.MutableRefObject<null>
}) => {
    /**
     * @param {string} tierId necessary for the drop handler
     * @returns {React.JSX.Element[]} the 5 cells contained in a tier
     */
    const TierCells = (tierId: string): React.JSX.Element[] => {
        const cells: React.JSX.Element[] = [];

        for (let cell = 0; cell < 5; cell++) {
            cells.push(
                <ElementInCell
                    key={cell}
                    dropHandler={dropHandler}
                    rankedElements={rankedElements}
                    tierId={tierId}
                    position={cell}
                    template={template!}
                    readonly={readonly}
                />
            );
        }

        return cells;
    }

    /**
     * @returns {React.JSX.Element[]} all tiers that the template has
     */
    const TiersLines = (): React.JSX.Element[] => {
        if (!template) { return []; }

        const lines: React.JSX.Element[] = [];

        template.tiers.forEach(tier => {
            lines.push(
                <div className={tier_line_style} style={{ backgroundColor: TIERS_COLORS[tier.rank]}} key={tier.id}>
                    {TierCells(tier.id!)}
                </div>
            );
        });

        return lines;
    };

    return(<>
        <div className={tiers_grid_style} ref={innerRef}>
            {TiersLines()}
        </div>
    </>);
};

export default RankingGrid;

/**
 * CSS STYLES
 */
const tiers_grid_style = css({
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '530px',
    margin: 'auto',
    width: '100%'
});

const tier_line_style = css({
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
});
