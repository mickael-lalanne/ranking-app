import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ERankingAppRoutes } from '../AppRoutes';
import { useUser } from '@clerk/clerk-react';
import { SignOutButton } from '@clerk/clerk-react';
import AppTitle from './shared/AppTitle';
import { THEMES_COLORS } from '../utils/theme';
import { EResponsiveBreakpoints } from '../utils/css-utils';

const Home = () => {
    const [userName, setUserName] = useState<string>();

    const { user } = useUser();

    // Called when the component is initialized
    useEffect(() => {
        if (user && user.fullName) {
            setUserName(user.fullName);
        }
    }, []);

    const Header = () => {
        return <div className={header_style}>
            <AppTitle title={`Hey ${userName}`} subtitle='Welcome to your ranking app' />
        </div>
    };

    const Footer = () => {
        return <div className={footer_style}>
            <SignOutButton>
                <div
                    className={logout_btn_style}
                    data-cy="logout-button"
                >
                    Logout
                </div>
            </SignOutButton>
        </div>
    };

    return <div className={home_container_style}>
        {Header()}

        <div className={sections_container_style}>
            <NavLink
                tag={Link}
                className={home_item_style}
                to={ERankingAppRoutes.templates}
                data-cy="template-button"
            >
                My templates
            </NavLink>

            <NavLink
                tag={Link}
                className={home_item_style}
                to={ERankingAppRoutes.tierlists}
            >
                My Tierlists
            </NavLink>
        </div>

        {Footer()}
    </div>;
};

export default Home;

/**
 * CSS STYLES
 */
const HOME_PAGE_MARGIN = '25px';
const HEADER_FOOTER_SIZE = '20vh';

const home_container_style = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    justifyContent: 'space-between'
});

const sections_container_style = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    fontSize: '25px',
    minHeight: 0,
    [`@media (max-width: ${EResponsiveBreakpoints.md})`]: {
        flexDirection: 'column'
    },
});

const home_item_style = css({
    display: 'flex',
    alignItems: 'center',
    maxWidth: '300px',
    width: '300px',
    justifyContent: 'center',
    aspectRatio: '1 / 1',
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px;',
    margin: '25px',
    position: 'relative',
    transition: 'transform 250ms ease-in-out',
    fontFamily: '"Raleway", sans-serif',
    textTransform: 'capitalize',
    ':hover': {
        transform: 'scale(1.15)',
    }
});

const header_style = css({
    marginTop: HOME_PAGE_MARGIN,
    height: HEADER_FOOTER_SIZE,
    display: 'flex',
    alignItems: 'center',
    [`@media (max-width: ${EResponsiveBreakpoints.md})`]: {
        height: 'fit-content'
    },
});

const footer_style = css({
    marginBottom: HOME_PAGE_MARGIN,
    height: HEADER_FOOTER_SIZE,
    display: 'flex',
    alignItems: 'flex-end',
    [`@media (max-width: ${EResponsiveBreakpoints.md})`]: {
        height: 'fit-content'
    },
});

const logout_btn_style = css({
    cursor: 'pointer',
    '&:hover': {
        color: THEMES_COLORS?.primary,
        textDecoration: 'underline'
    }
});
