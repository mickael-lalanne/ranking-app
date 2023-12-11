import { ThemeOptions, alpha } from '@mui/material';
const PRIMARY_COLOR = '#BB2525';

export const RANKING_APP_THEME: ThemeOptions = {
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
};

export const ELEMENT_SIZE: string = '75px';
