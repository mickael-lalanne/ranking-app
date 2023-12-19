import React from 'react';
import { css } from '@emotion/css';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { THEMES_COLORS } from '../../utils/theme';

const InfoBox = (
    { content } : { content: string; }
) => {
    return(
        <div className={message_box_style}>
            <TipsAndUpdatesIcon className={box_icon_style} />
            <span dangerouslySetInnerHTML={{__html: content}}></span>
        </div>
    );
};

export default InfoBox;

/**
 * CSS STYLES
 */
const message_box_style = css({
    position: 'relative',
    boxShadow:' rgba(149, 157, 165, 0.2) 0px 8px 24px',
    padding: '30px',
    maxWidth: '410px',
    backgroundColor: THEMES_COLORS?.info,
    color: 'white',
    height: 'fit-content'
});

const box_icon_style = css({
    position: 'absolute',
    right: -15,
    top: -15,
    color: THEMES_COLORS?.info,
    border: `2px solid ${THEMES_COLORS?.info}`,
    borderRadius: '50%',
    padding: '5px',
    backgroundColor: 'white',
    width: '50px !important',
    height: '50px !important',
    boxShadow:' rgba(149, 157, 165, 0.2) 0px 8px 24px'
});