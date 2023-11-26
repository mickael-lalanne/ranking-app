import React from 'react';
import { css } from '@emotion/css';
import { Tierlist } from '../../models/Tierlist';
import { useAppSelector } from '../../app/hooks';
import { Template } from '../../models/Template';
import RankingGrid from './RankingGrid';
import { ViewerComponentProps } from '../../models/RankingLayout';

const TierlistsViewer = ({ editHandler } : ViewerComponentProps) => {
    // Retrieve user tierlists from the store
    const userTierlists: Tierlist[] = useAppSelector((state) => state.tierlists.tierlists);
    const userTemplates: Template[] = useAppSelector((state) => state.templates.templates);

    const TierlistPreview = (tierlist: Tierlist): React.JSX.Element => {
        const tierlistTemplate: Template | undefined = userTemplates.find(t => t.id === tierlist.templateId);
        return (
            <RankingGrid
                readonly
                rankedElements={tierlist.rankedElements}
                template={tierlistTemplate}
            />
        );
    };

    const TierlistsList = (): React.JSX.Element[] => {
        const tierlists: React.JSX.Element[] = [];

        userTierlists.forEach(tierlist => {
            tierlists.push(
                <div className={tierlist_element_style} key={tierlist.id} onClick={() => editHandler(tierlist)}>
                    {TierlistPreview(tierlist)}
                    <div className={tierlist_title_style}>{tierlist.name}</div>
                </div>
            );
        });

        return tierlists;
    };

    return(<div>
        <div className={viewer_container_style}>
            {TierlistsList()}
        </div>
        <div></div>
    </div>);
};

export default TierlistsViewer;

/**
 * CSS STYLES
 */
const viewer_container_style = css({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
});

const tierlist_element_style = css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    boxShadow:' rgba(149, 157, 165, 0.2) 0px 8px 24px',
    margin: '25px',
    padding: '25px',
    cursor: 'pointer',
    transitionDuration: '500ms',
    maxWidth: '350px',
    ":hover": {
        transform: 'scale(1.08)'
    }
});

const tierlist_title_style = css({
    marginTop: '15px'
});
