import React from 'react';
import { css } from '@emotion/css';
import { Tierlist } from '../../models/Tierlist';
import { useAppSelector } from '../../app/hooks';
import { Template } from '../../models/Template';
import RankingGrid from './RankingGrid';
import { ViewerComponentProps } from '../../models/RankingLayout';
import { sortedTierlistsSelector } from '../../store/TierlistStore';
import { sortedTemplatesSelector } from '../../store/TemplateStore';
import InfoBox from '../shared/InfoBox';
import AppLoading from '../shared/AppLoading';

const TierlistsViewer = ({ editHandler } : ViewerComponentProps) => {
    // Retrieve user tierlists from the store
    const userTierlists: Tierlist[] = useAppSelector(sortedTierlistsSelector);
    const userTemplates: Template[] = useAppSelector(sortedTemplatesSelector);
    const fetchingTierlists: boolean = useAppSelector(state => state.application.fetchingTierlists);

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

    const EmptyMessage = (): React.JSX.Element | undefined => {
        // NO TEMPLATE MESSAGE
        if (userTemplates.length === 0) {
            return <InfoBox content="It seems you don't have any template yet. <br>Start by going to the templates page !" />;
        }

        // NO TIERLIST MESSAGE
        else if (userTierlists.length === 0) {
            return <InfoBox
                content="It seems you don't have any tierlist yet. <br>Click on the button above to start your ranking !"
            />;
        }
    };

    // Show a loading if the tierlists have not yet been fetch from database
    if (fetchingTierlists) {
        return <AppLoading text='Fetching tierlists' />;
    }

    return(<div>
        <div className={viewer_container_style}>
            {EmptyMessage()}
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
    alignItems: 'stretch',
    flexWrap: 'wrap',
    height: 'fit-content'
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
    aspectRatio: '1 / 1',
    ":hover": {
        transform: 'scale(1.08)'
    }
});

const tierlist_title_style = css({
    marginTop: '15px'
});
