import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { css } from '@emotion/css';
import LinearProgress from '@mui/material/LinearProgress';
import { useAppSelector } from '../app/hooks';
import { THEMES_COLORS } from '../utils/theme';
import { SignOutButton } from '@clerk/clerk-react';

const NavMenu = (
    { height }: { height: string}
) => {
    const [collapsed, setCollapsed] = useState<boolean>(true);

    const loading: boolean = useAppSelector(state => state.application.loading);

    const toggleNavbar = () =>  {
        setCollapsed(!collapsed);
    }

    const ShowLoading = (): React.JSX.Element | undefined => {
        if (loading) {
            return <LinearProgress
                color="primary"
                className={loading_indicator_style}
                style={{ position: 'absolute' }}
            />;
        }
    };

    return (
        <header style={{ minHeight: height }} className={ loading ? nav_disabled_style : '' }>
            <Navbar
                className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
                container
                light
            >
                <NavbarBrand tag={Link} to="/">
                    Ranking App
                </NavbarBrand>
                <NavbarToggler
                    onClick={toggleNavbar}
                    className="mr-2"
                />
                <Collapse
                    className="d-sm-inline-flex flex-sm-row-reverse"
                    isOpen={!collapsed}
                    navbar
                >
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink
                                tag={Link}
                                className={navlink_style}
                                to="/"
                            >
                                Home
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                tag={Link}
                                className={navlink_style}
                                to="/templates"
                            >
                                Templates
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                tag={Link}
                                className={navlink_style}
                                to="/tierlists"
                            >
                                Tierlists
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={navlink_style}>
                                <SignOutButton>
                                    <span>Logout</span>
                                </SignOutButton>
                            </NavLink>
                        </NavItem>
                    </ul>
                </Collapse>
            {ShowLoading()}
            </Navbar>
        </header>
    );
}
export default NavMenu;

/**
 * CSS STYLES
 */
const navlink_style = css({
    color: 'black',
    cursor: 'pointer',
    '&:hover': {
        color: THEMES_COLORS?.primary,
        textDecoration: 'underline'
    }
});

const loading_indicator_style = css({
    bottom: '0',
    left: 0,
    width: '100%'
});

const nav_disabled_style = css({
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0.5
});
