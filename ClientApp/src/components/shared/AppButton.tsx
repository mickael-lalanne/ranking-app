import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { useTheme } from '@mui/material/styles';

const AppButton = (
    { text, onClickHandler, color, disabled = false } : {
        text: string;
        onClickHandler: () => void,
        color?: string,
        disabled?: boolean
    }
) => {
    const theme = useTheme();
    const [btnColor, setBtnColor] = useState<string>(theme.defaultRankingTheme.primary);

    // Change the default button color if a color is provided
    useEffect(() => {
        if (color) {
            setBtnColor(color);
        }
    }, [color]);

    return(
        <button
            className={`
                ${add_btn_pushable}
                ${disabled ? add_btn_disable : ''}
            `}
            role="button"
            onClick={onClickHandler}
            disabled={disabled}
        >
            <span className={add_btn_shadow + ' add_btn_shadow'}></span>
            <span className={app_add_btn_edge} style={{ background: btnColor }}></span>
            <span
                className={app_add_btn_front + ' add_btn_front'}
                style={{ background: btnColor, color: btnColor === 'white' ? 'black' : 'white' }}
            >
                {text}
            </span>
        </button>
    );
};

export default AppButton;

/**
 * CSS STYLES
 */
const add_btn_pushable = css`
    height: fit-content;
    position: relative;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    outline-offset: 4px;
    transition: filter 250ms;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    &:hover {
        filter: brightness(110%);
        -webkit-filter: brightness(110%);
        .add_btn_front {
            transform: translateY(-6px);
            transition:
              transform
              250ms
              cubic-bezier(.3, .7, .4, 1.5);
        }
        .add_btn_shadow {
            transform: translateY(4px);
            transition:
                transform
                250ms
                cubic-bezier(.3, .7, .4, 1.5);
        }
    }
    &:active {
        .add_btn_front {
            transform: translateY(-2px);
            transition: transform 34ms;
        }
        .add_btn_shadow {
            transform: translateY(1px);
            transition: transform 34ms;
        }
    }
    &:focus:not(:focus-visible) {
        outline: none;
    }
`;

const add_btn_shadow = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: hsl(0deg 0% 0% / 0.25);
    will-change: transform;
    transform: translateY(2px);
    transition:
        transform
        600ms
        cubic-bezier(.3, .7, .4, 1);
`;

const app_add_btn_edge = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    filter: brightness(0.5);
`;

const app_add_btn_front = css`
    display: block;
    position: relative;
    padding: 12px 27px;
    border-radius: 12px;
    font-size: 1.1rem;
    will-change: transform;
    transform: translateY(-4px);
    transition:
        transform
        600ms
        cubic-bezier(.3, .7, .4, 1);
    border: 1px solid black;
`;

const add_btn_disable = css({
    filter: 'grayscale(1)',
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0.5
});
