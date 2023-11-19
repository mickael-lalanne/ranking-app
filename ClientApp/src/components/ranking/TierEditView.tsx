import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { css } from '@emotion/css';
import { TIERS_COLORS, Tier } from '../../models/Template';
import { generateRandomId } from '../../services/Util';

enum TierViewMode {
    Edit = 'edit', // When user wants to edit a tier 
    Create = 'create', // When user wants to create a tier
    Hide = 'hide' // When the view isn't displayed
};

/**
 * View displayed when the user wants to create a new tier or edit an existing one
 */
const TierEditView = ({createCallback, existingTiers}: {
    createCallback: (tier: Tier) => void,
    existingTiers: Tier[]
}) => {
    const [tierEditView, setTierEditView] = useState<TierViewMode>(TierViewMode.Hide);
    const [tierRank, setTierRank] = useState<number>();
    const [tierName, setTierName] = useState<string>();
    const [availableRanks, setAvailableRanks] = useState<number[]>([0, 1, 2, 3, 4]);
    
    /**
     * Called when the existingTiers props has changed
     * Update the availableRanks array
     */
    useEffect(() => {
        setAvailableRanks(availableRanks.filter(r => existingTiers.find(tier => tier.rank === r) === undefined));
    }, [existingTiers]);

    // Called when the "Add tier" button has been clicked
    const showCreateView = () => {
        setTierEditView(TierViewMode.Create);
    };

    // Called when the "Cancel" button of the edit view has been clicked 
    const hideEditView = () => {
        setTierEditView(TierViewMode.Hide);
    };

    // Called when the "Create" button of the edit view has been clicked
    const createTier = () => {
        createCallback({
            id: generateRandomId(),
            name: tierName as string,
            rank: tierRank as number
        });
        setTierEditView(TierViewMode.Hide);
    };

    // Called when the tier name has changed
    const onNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTierName(e.target.value);
    };

    // Display all the rank available for the new tier
    const RankSelector = (): JSX.Element => {
        const rankCells: JSX.Element[] = [];

        for (let i = 0; i < 5; i++) {
            rankCells.push(
                <div
                    style={{backgroundColor: TIERS_COLORS[i]}}
                    className={`
                        ${rank_cell_style}
                        ${tierRank === i ? rank_cell_selected_style : undefined}
                        ${availableRanks.find(r => r === i) !== undefined ? undefined : rank_cell_disabled_style}
                    `}
                    onClick={() => setTierRank(i)}
                >
                    { `${i + 1}`}
                </div>
            );
        }

        return(<div style={{ display: 'flex' }}>{rankCells}</div>)
    };

    if (tierEditView !== TierViewMode.Hide) {
        return (<div className={tiers_edit_view_container_style}>
            <TextField
                label="Tier name"
                variant="outlined"
                onChange={onNameFieldChange}
            />
            <div className={tier_position_style}>
                <div>Rank :</div>
                {RankSelector()}
            </div>
            <div className={footer_buttons_style}>
                <div className="app_spacer"></div>
                <Button variant="outlined" onClick={hideEditView}>Cancel</Button>
                <Button variant="contained" onClick={createTier} style={{ marginLeft: '10px' }}>Create</Button>
            </div>
        </div>);
    }

    return <Button variant="contained" className={add_btn_style} onClick={showCreateView}>Add Tier</Button>;
};

export default TierEditView;

/**
 * CSS STYLES
 */
const tiers_edit_view_container_style = css({
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px;',
    marginTop: '15px',
    padding: '30px'
});

const footer_buttons_style = css({
    display: 'flex'
});

const tier_position_style = css({
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px'
});

const rank_cell_style = css({
    padding: '5px',
    margin: '5px',
    width: '25px',
    height: '25px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    justifyContent: 'center'
});

const rank_cell_selected_style = css({
    transform: 'scale(1.3)',
    border: '1px solid black'
});

const rank_cell_disabled_style = css({
    userSelect: 'none',
    pointerEvents: 'none',
    opacity: 0.3,
    borderColor: 'unset'
});

const add_btn_style = css({
    marginTop: '5px',
    width: '100%'
});