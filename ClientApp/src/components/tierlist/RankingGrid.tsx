import React from 'react';
import { css } from '@emotion/css';
import { TIERS_COLORS, Template } from '../../models/Template';

const RankingGrid = ({ template }: { template?: Template}) => {
    /**
     * @returns {React.JSX.Element[]} the 5 cells contained in a tier
     */
    const TierCells = (): React.JSX.Element[] => {
        const cells: React.JSX.Element[] = [];

        for (let cell = 0; cell < 5; cell++) {
            cells.push(<div className={tier_cell_style} key={cell}></div>)
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
                    {TierCells()}
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
    margin: 'auto'
});

const tier_line_style = css({
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
});

const tier_cell_style = css({
    width: '20%',
    aspectRatio: '1 / 1'
});
