import React from 'react';
import { css } from '@emotion/css';

const AddButton = (
    { text, onClickHandler } : { text: string; onClickHandler: () => void }
) => {
    return(
        <button className={add_btn_pushable} role="button" onClick={onClickHandler}>
            <span className={add_btn_shadow + ' add_btn_shadow'}></span>
            <span className={app_add_btn_edge}></span>
            <span className={app_add_btn_front + ' add_btn_front'}>
                {text}
            </span>
        </button>
    );
};

export default AddButton;

/**
 * CSS STYLES
 */
const add_btn_pushable = css`
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
    background: linear-gradient(
        to left,
        hsl(340deg 100% 16%) 0%,
        hsl(340deg 100% 32%) 8%,
        hsl(340deg 100% 32%) 92%,
        hsl(340deg 100% 16%) 100%
    );
`;

const app_add_btn_front = css`
    display: block;
    position: relative;
    padding: 12px 27px;
    border-radius: 12px;
    font-size: 1.1rem;
    color: white;
    background: hsl(345deg 100% 47%);
    will-change: transform;
    transform: translateY(-4px);
    transition:
        transform
        600ms
        cubic-bezier(.3, .7, .4, 1);
`;
