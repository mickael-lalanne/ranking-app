import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import { css } from '@emotion/css';
import { ThemeProvider } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { RANKING_APP_THEME } from '../utils/theme';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { CLOUDINARY_API_URL } from '../services/CloudinaryService';

const NAV_HEADER_HEIGHT = '60px';

const Layout = ({ children }: { children: React.JSX.Element[] }) => {
    const [navHeader, setNavHeader] = useState<boolean>(false);
    const { getToken, isSignedIn } = useAuth();
    const location = useLocation();

    // Called when the user has signed in
    useEffect(() => {
        // Add a request interceptor to have the Authorization header on all requests
        axios.interceptors.request.use(async config => {
            // Don't add the token when uploading and deleting images in cloudinary
            if (config.url && !config.url.startsWith(CLOUDINARY_API_URL)) {
                const token = await getToken();
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }, [isSignedIn]);

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
        <ThemeProvider theme={RANKING_APP_THEME}>
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
