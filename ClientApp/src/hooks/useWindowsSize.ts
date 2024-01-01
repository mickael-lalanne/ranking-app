import { useEffect, useState } from 'react';

export function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<{ width?: number, height?: number}>({
        width: undefined,
        height: undefined,
    });
    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: _convertPxSizeToEm(window.innerWidth),
                height: _convertPxSizeToEm(window.innerHeight),
            });
        }
        // Add event listener
        window.addEventListener('resize', handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
};

/**
 * Convert the window size from pixels to em
 * @param {number} sizeInPx window size in pixels 
 * @returns {number} window size in em
 */
const _convertPxSizeToEm = (sizeInPx: number): number => {
    return sizeInPx / parseFloat(
        getComputedStyle(document.querySelector('body')!).fontSize
    ) | sizeInPx; // Added | sizeInPx otherwises it returns a NaN value in jest tests
};
