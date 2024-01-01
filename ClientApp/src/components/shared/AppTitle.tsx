import React from 'react';
import { css } from '@emotion/css';

const AppTitle = (
    { title, subtitle, margin = '25px 0' } : { title: string; subtitle: string; margin?: string; }
) => {
    return(
        <div className={app_title_style} style={{ margin }}>
            <h1>
                {title}
                <span>{subtitle}</span>
            </h1>
        </div>
    );
};

export default AppTitle;

/**
 * CSS STYLES
 */
const app_title_style = css`
    h1 em {
        font-style: normal;
        font-weight: 600;
    }

    h1 {
        text-transform: capitalize;
        position: relative;
        padding: 0;
        margin: 0;
        font-family: "Raleway", sans-serif;
        font-weight: 300;
        font-size: 25px;
        color: #080808;
        -webkit-transition: all 0.4s ease 0s;
        -o-transition: all 0.4s ease 0s;
        transition: all 0.4s ease 0s;
    }

    h1:before {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 60px;
        height: 2px;
        content: "";
        background-color: #c50000;
    }

    h1 span {
        font-size: 13px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 4px;
        line-height: 3em;
        padding-left: 0.25em;
        color: rgba(0, 0, 0, 0.4);
        padding-bottom: 10px;
        display: block;
        font-size: 0.5em;
        line-height: 1.3;
        margin-top: 5px;
    }
`;
  