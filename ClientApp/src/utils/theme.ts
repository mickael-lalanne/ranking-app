import { Theme, createTheme, alpha, ThemeOptions } from "@mui/material";

interface RankingTheme {
    primary: string;
    primaryLight: string;
    light: string;
    dark: string;
    info: string;
};
const PRIMARY_COLOR = '#BB2525';

declare module '@mui/material/styles' {
    interface Theme {
        defaultRankingTheme: {
            primary: string;
            primaryLight: string;
            light: string;
            dark: string;
            info: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        defaultRankingTheme?: {
            primary: string;
            primaryLight: string;
            light: string;
            dark: string;
            info: string;
        };
    }
}

export const THEMES_COLORS: ThemeOptions['defaultRankingTheme'] = {
    primary: PRIMARY_COLOR,
    primaryLight: '#FF6969',
    light: '#FFF5E0',
    dark: '#141E46',
    info: '#9ED9EB'
}

export const RANKING_APP_THEME: Theme = createTheme({
    defaultRankingTheme: THEMES_COLORS,
    palette: {
        primary: {
            main: alpha(PRIMARY_COLOR, 0.7),
            light: alpha(PRIMARY_COLOR, 0.5),
            dark: alpha(PRIMARY_COLOR, 0.9),
        }
    }
});
