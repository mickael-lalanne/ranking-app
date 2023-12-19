import React from 'react';
import { TIERS_COLORS, Template, Tier } from '../../models/Template';
import { css } from '@emotion/css';
import { useAppSelector } from '../../app/hooks';
import { ViewerComponentProps } from '../../models/RankingLayout';
import { sortedTemplatesSelector } from '../../store/TemplateStore';
import InfoBox from '../shared/InfoBox';

const TemplatesViewer = ({ editHandler } : ViewerComponentProps) => {
    // Retrieve user templates from the store
    const userTemplates: Template[] =
        useAppSelector(state => sortedTemplatesSelector(state.templates));

    /**
     * Some design to display tiers colors in the template preview
     * @param {Tiers} tiers template's tiers
     * @returns {JSX.Element[]} divs containing with the tiers colors in background
     */
    const generateTemplateTiersItems = (tiers: Tier[]): JSX.Element[] => {
        const tierItems: JSX.Element[] = [];

        tiers.forEach(tier => {
            tierItems.push(
                <div className={tier_style} key={tier.id} style={{backgroundColor: TIERS_COLORS[tier.rank]}}></div>
            );
        });

        return tierItems;
    };

    /**
     * Display a preview for all user's template
     * @returns {JSX.Element[]} squares with data like the template name and its tiers
     */
    const generateTemplatesPreviewItems = (): JSX.Element[] => {
        const litsItems: JSX.Element[] = [];

        userTemplates.forEach(template => {
            litsItems.push(
                <div className={template_container_style} key={template.id} onClick={() => editHandler(template)}>
                    <div className="app_spacer"></div>
                    <div style={{ padding: '20px' }}>{template.name}</div>
                    <div className="app_spacer"></div>
                    {generateTemplateTiersItems(template.tiers)}
                </div>
            );
        });

        return litsItems;
    };

    const EmptyMessage = (): React.JSX.Element | undefined => {
        // NO TEMPLATE MESSAGE
        if (userTemplates.length === 0) {
            return <InfoBox content="It seems you don't have any template yet. <br>Click on the button above to start your creation !" />;
        }
    };

    return (<>
        {EmptyMessage()}
        <div className={templates_container_style}>
            {generateTemplatesPreviewItems()}
        </div>
    </>);
};

export default TemplatesViewer;

/**
 * CSS STYLES
 */
const templates_container_style = css({
    display: 'flex',
    flexWrap: 'wrap'
});

const template_container_style = css({
    display: 'flex',
    alignItems: 'center',
    margin: '25px',
    width: '200px',
    height: '200px',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
    cursor: 'pointer',
    transitionDuration: '500ms',
    textAlign: 'center',
    ":hover": {
        transform: 'scale(1.15)'
    }
});

const tier_style = css({
    width: '100%',
    height: '5px',
});
