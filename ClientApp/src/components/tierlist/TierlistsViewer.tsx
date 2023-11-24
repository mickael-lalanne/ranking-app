import React from 'react';
import { css } from '@emotion/css';
import { Tierlist } from '../../models/Tierlist';
import { useAppSelector } from '../../app/hooks';

const TierlistsViewer = () => {
    // Retrieve user tierlists from the store
    const userTierlists: Tierlist[] = useAppSelector((state) => state.tierlists.tierlists);

    const TierlistsList = (): React.JSX.Element[] => {
        const tierlists: React.JSX.Element[] = [];

        userTierlists.forEach(tierlist => {
            tierlists.push(
                <div className={tierlist_element_style}>
                    {tierlist.name}

                    {/* TODO: show a preview with tiers and ranked elements */}
                </div>
            );
        });

        return tierlists;
    };

    return(<div className={viewer_container_style}>
        {TierlistsList()}
    </div>);
};

export default TierlistsViewer;

/**
 * CSS STYLES
 */
const viewer_container_style = css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
});


const tierlist_element_style = css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
});
