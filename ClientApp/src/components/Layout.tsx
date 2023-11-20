import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { css } from '@emotion/css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const NAV_HEADER_HEIGHT = '60px';

const theme = createTheme({
    defaultRankingTheme: {
        primary: '#BB2525',
        primaryLight: '#FF6969',
        light: '#FFF5E0',
        dark: '#141E46',
    },
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
