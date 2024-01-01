import React from 'react';
import { css, keyframes } from '@emotion/css';
import { THEMES_COLORS } from '../../utils/theme';

const AppLoading = ({ text }: { text: string; }) => {
    return (<div className={container_style} data-cy="app-loading">
        <div className={scene_style}>
            <div className={cube_wrapper_style}>
                <div className={cube_style}>
                    <div className={cube_faces_style}>
                        <div className={cube_face_style + ' ' + shadow_style}></div>
                        <div className={cube_face_style + ' ' + bottom_style}></div>
                        <div className={cube_face_style + ' ' + top_style}></div>
                        <div className={cube_face_style + ' ' + left_style}></div>
                        <div className={cube_face_style + ' ' + right_style}></div>
                        <div className={cube_face_style + ' ' + back_style}></div>
                        <div className={cube_face_style + ' ' + front_style}></div>
                    </div>
                </div>
            </div>
        </div>
        <div className={text_container_style}>
            <div className={text_style}>{text}</div>
            <div className={dot_pulse_style}></div>
        </div>
    </div>);
};

export default AppLoading;

/**
 * CSS STYLES
 */
const scale = keyframes`
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
`;

const container_style = css({
    width: 'fit-content',
    animation: `${scale} .5s`,
    height: 'fit-content'
});

const text_container_style = css({
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content'
});

const text_style = css({
    marginRight: '30px',
    fontFamily: '"Raleway", sans-serif',
    color: THEMES_COLORS?.primary,
    fontSize: '18px',
    fontWeight: 600,
    fontStyle: 'italic'
});

/****************************************
 *           CUBE ANIMATION
 ****************************************/
const bouncing = keyframes`
    0% {
        transform: translateY(-40px);
        animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
    }
    45% {
        transform: translateY(40px);
        animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    }
    100% {
        transform: translateY(-40px);
        animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
    }
`;

const bouncingShadow = keyframes`
    0% {
        transform: translateZ(-80px) scale(1.3);
        animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
        opacity: 0.05;
    }
    45% {
        transform: translateZ(0);
        animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
        opacity: 0.3;
    }
    100% {
        transform: translateZ(-80px) scale(1.3);
        animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
        opacity: 0.05;
    }
`;

const rotation = keyframes`
    0% {
        transform: rotateX(45deg) rotateY(0) rotateZ(45deg);
        animation-timing-function: cubic-bezier(0.17, 0.84, 0.44, 1);
    }
    50% {
        transform: rotateX(45deg) rotateY(0) rotateZ(225deg);
        animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
    }
    100% {
        transform: rotateX(45deg) rotateY(0) rotateZ(405deg);
        animation-timing-function: cubic-bezier(0.17, 0.84, 0.44, 1);
    }
`;

const scene_style = css({
    position: 'relative',
    zIndex: 2,
    height: '220px',
    width: '220px',
    display: 'grid',
    placeItems: 'center'
});

const cube_wrapper_style = css({
    transformStyle: 'preserve-3d',
    animation: `${bouncing} 2s infinite`
});

const cube_style = css({
    transformStyle: 'preserve-3d',
    transform: 'rotateX(45deg) rotateZ(45deg)',
    animation: `${rotation} 2s infinite`
});

const cube_faces_style = css({
    transformStyle: 'preserve-3d',
    height: '80px',
    width: '80px',
    position: 'relative',
    transformOrigin: '0 0',
    transform: 'translateX(0) translateY(0) translateZ(-40px)'
});

const cube_face_style = css({
    position: 'absolute',
    inset: 0,
    background: THEMES_COLORS?.dark,
    border: `solid 1px ${THEMES_COLORS?.primary}`
});

const shadow_style = css({
    transform: 'translateZ(-80px)',
    animation: `${bouncingShadow} 2s infinite`
});

const bottom_style = css({
});

const top_style = css({
    transform: 'translateZ(80px)'
});

const left_style = css({
    transformOrigin: '50% 0',
    transform: 'rotateX(-90deg) translateY(-80px) translateZ(80px)'
});

const right_style = css({
    transformOrigin: '50% 0',
    transform: 'rotateX(-90deg) translateY(-80px)'
});

const back_style = css({
    transformOrigin: '0 50%',
    transform: 'rotateY(-90deg) translateZ(-80px)'
});

const front_style = css({
    transformOrigin: '0 50%',
    transform: 'rotateY(-90deg)'
});

/****************************************
 *           THREE DOTS
 ****************************************/

const dotPulse = keyframes`
    0% {
        box-shadow: 9999px 0 0 -5px;
    }
    30% {
        box-shadow: 9999px 0 0 2px;
    }
    60%, 100% {
        box-shadow: 9999px 0 0 -5px;
    }
`;

const dotPulseBefore = keyframes`
    0% {
        box-shadow: 9984px 0 0 -5px;
    }
    30% {
        box-shadow: 9984px 0 0 2px;
    }
    60%, 100% {
        box-shadow: 9984px 0 0 -5px;
    }
`;

const dotPulseAfter = keyframes`
    0% {
        box-shadow: 10014px 0 0 -5px;
    }
    30% {
        box-shadow: 10014px 0 0 2px;
    }
    60%, 100% {
        box-shadow: 10014px 0 0 -5px;
    }
`;

const dot_pulse_style = css({
    position: 'relative',
    left: '-9999px',
    width: '10px',
    height: '10px',
    borderRadius: '5px',
    backgroundColor: THEMES_COLORS?.primary,
    color: THEMES_COLORS?.primary,
    boxShadow: '9999px 0 0 -5px',
    animation: `${dotPulse} 1.5s infinite linear`,
    animationDelay: '0.25s',
    ':before, :after': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        top: 0,
        width: '10px',
        height: '10px',
        borderRadius: '5px',
        backgroundColor: THEMES_COLORS?.primary,
        color: THEMES_COLORS?.primary
    },
    ':before': {
        boxShadow: '9984px 0 0 -5px',
        animation: `${dotPulseBefore} 1.5s infinite linear`,
        animationDelay: '0s'
    },
    ':after': {
        boxShadow: '10014px 0 0 -5px',
        animation: `${dotPulseAfter} 1.5s infinite linear`,
        animationDelay: '0.5s'
    }
});
