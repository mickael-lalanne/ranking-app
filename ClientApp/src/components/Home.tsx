import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ERankingAppRoutes } from '../AppRoutes';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import AppTitle from './shared/AppTitle';
import { THEMES_COLORS } from '../utils/theme';
import { EResponsiveBreakpoints } from '../utils/css-utils';
import logo from '../assets/logo.png';

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
            <img src={logo} className={logo_style} />
            <AppTitle title="" subtitle={`Welcome, ${userName}`} margin='15px 0' />
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
                data-cy="tierlist-button"
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
const home_container_style = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    justifyContent: 'space-between',
    paddingTop: '10vh'
});

const sections_container_style = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    fontSize: '25px',
    minHeight: 0,
    flex: 2,
    [`@media (max-width: ${EResponsiveBreakpoints.md})`]: {
        flexDirection: 'column'
    },
    [`@media (max-width: ${EResponsiveBreakpoints.sm})`]: {
        flex: 3,
        paddingBottom: '10vh'
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
    minHeight: '100px',
    maxHeight: '-webkit-fill-available',
    ':hover': {
        transform: 'scale(1.10)',
    }
});

const header_style = css({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
    [`@media (max-width: ${EResponsiveBreakpoints.lg})`]: {
        justifyContent: 'center',
    },
    [`@media (max-width: ${EResponsiveBreakpoints.sm})`]: {
        flex: 0
    },
});

const logo_style = css({
    maxHeight: '130px',
    [`@media (max-width: ${EResponsiveBreakpoints.sm})`]: {
        maxHeight: '90px'
    },
});

const footer_style = css({
    display: 'flex',
    flex: 1,
    alignItems: 'flex-end',
    paddingBottom: '20px',
    [`@media (max-width: ${EResponsiveBreakpoints.sm})`]: {
        flex: 0
    },
});

const logout_btn_style = css({
    cursor: 'pointer',
    '&:hover': {
        color: THEMES_COLORS?.primary,
        textDecoration: 'underline'
    }
});
