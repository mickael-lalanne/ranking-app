import React, { Component } from 'react';
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
import { RANKING_APP_THEME } from '../utils/css-utils';

interface IRecipeProps {
    height: string;
}
interface IRecipeState {
    collapsed?: boolean;
}
export class NavMenu extends Component<IRecipeProps, IRecipeState> {
    static displayName = NavMenu.name;

    constructor(props: IRecipeProps) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return (
            <header style={{ height: this.props.height }}>
                <Navbar
                    className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
                    container
                    light
                >
                    <NavbarBrand tag={Link} to="/">
                        Ranking App
                    </NavbarBrand>
                    <NavbarToggler
                        onClick={this.toggleNavbar}
                        className="mr-2"
                    />
                    <Collapse
                        className="d-sm-inline-flex flex-sm-row-reverse"
                        isOpen={!this.state.collapsed}
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
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}

/**
 * CSS STYLES
 */
const navlink_style = css({
    color: 'black',
    '&:hover': {
        color: RANKING_APP_THEME.defaultRankingTheme?.primary,
        textDecoration: 'underline'
    }
});
