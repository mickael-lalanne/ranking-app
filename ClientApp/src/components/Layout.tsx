import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { css } from '@emotion/css';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';

const NAV_HEADER_HEIGHT = '60px';
const PRIMARY_COLOR = '#BB2525';

const theme = createTheme({
    defaultRankingTheme: {
        primary: PRIMARY_COLOR,
        primaryLight: '#FF6969',
        light: '#FFF5E0',
        dark: '#141E46',
    },
    palette: {
        primary: {
            main: alpha(PRIMARY_COLOR, 0.7),
            light: alpha(PRIMARY_COLOR, 0.5),
            dark: alpha(PRIMARY_COLOR, 0.9),
        }
    }
});

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

interface IRecipeProps {
    children?: any;
}

export class Layout extends Component<IRecipeProps> {
    static displayName = Layout.name;

    render() {
        return (
            <ThemeProvider theme={theme}>
                <NavMenu height={NAV_HEADER_HEIGHT} />
                <Container
                    tag="main"
                    className={container_style}
                    style={{ height: `calc(100vh - ${NAV_HEADER_HEIGHT})` }}
                >
                    {this.props.children}
                </Container>
            </ThemeProvider>
        );
    }
}

/**
 * CSS STYLES
 */
const container_style = css({
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
});
