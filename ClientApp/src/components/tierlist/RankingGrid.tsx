import React, { useEffect } from 'react';
import { css } from '@emotion/css';
import { TIERS_COLORS, Template } from '../../models/Template';
import { RankedElement, Element } from '../../models/Element';
import ElementPreview from '../shared/ElementPreview';

const RankingGrid = ({ template, dropHandler, rankedElements, dragStartHandler, dragEndHandler, readonly = false }: {
    template?: Template,
    rankedElements: RankedElement[],
    dropHandler?: (tierId: string, rank: number) => void,
    dragStartHandler?: (element: Element) => void,
    dragEndHandler?: () => void,
    readonly?: boolean
}) => {
    /**
     * @param {string} tierId necessary for the drop handler
     * @returns {React.JSX.Element[]} the 5 cells contained in a tier
     */
    const TierCells = (tierId: string): React.JSX.Element[] => {
        const cells: React.JSX.Element[] = [];

        /**
         * Check if an element is ranked in the cell
         * @param {number} position the cell position 
         * @returns {React.JSX.Element} an element if the cell contains one
         */
        const ElementInCell = (position: number): React.JSX.Element => {
            const elementInCell: RankedElement | undefined = rankedElements.find(
                rankedElt => rankedElt.tierId === tierId && rankedElt.position === position
            );
            
            const elementObject: Element | undefined = template?.elements.find(
                elt => elt.id === elementInCell?.elementId
            );

            if (elementInCell && elementObject) {
                return (
                    <ElementPreview
                        element={elementObject}
                        dragStartHandler={dragStartHandler}
                        dragEndHandler={dragEndHandler}
                        readonly={readonly}
                        fitToContainer
                    />
                );
            }
            return <></>;
        };

        for (let cell = 0; cell < 5; cell++) {
            cells.push(
                <div
                    className={tier_cell_style}
                    key={cell}
                    onDrop={() => dropHandler ? dropHandler(tierId, cell) : undefined}
                    onDragOver={e => e.preventDefault()}
                    onDragEnter={e => e.preventDefault()}
                    draggable={!readonly}
                >
                    {ElementInCell(cell)}
                </div>
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
        <div className={tiers_grid_style}>
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

const tier_cell_style = css({
    width: '20%',
    aspectRatio: '1 / 1',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});
