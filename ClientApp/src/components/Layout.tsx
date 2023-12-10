import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import { css } from '@emotion/css';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { RANKING_APP_THEME } from '../utils/css-utils';

const NAV_HEADER_HEIGHT = '60px';

const theme: Theme = createTheme({ ...RANKING_APP_THEME });

declare module '@mui/material/styles' {
    interface Theme {
        defaultRankingTheme: {
            primary: string;
            primaryLight: string;
            light: string;
            dark: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        defaultRankingTheme?: {
            primary: string;
            primaryLight: string;
            light: string;
            dark: string;
        };
    }
}

const Layout = ({ children }: { children: React.JSX.Element[] }) => {
    const [navHeader, setNavHeader] = useState<boolean>(false);

    const location = useLocation();

    // Called when the url has changed
    useEffect(() => {
        // Don't show the nav menu in Home component
        setNavHeader(window.location.pathname !== '/');
    }, [location]);

    const ShowNavMenu = (): React.JSX.Element | undefined => {
        if (navHeader) {
            return <NavMenu height={NAV_HEADER_HEIGHT} />;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {ShowNavMenu()}
            <Container
                tag="main"
                className={container_style}
                style={{ height: `calc(100vh - ${NAV_HEADER_HEIGHT})` }}
            >
                {children}
            </Container>
        </ThemeProvider>
    );
}

export default Layout;

/**
 * CSS STYLES
 */
const container_style = css({
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
});
