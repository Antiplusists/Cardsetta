import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';

import { styled } from '@material-ui/core/styles';
import { Link as NavLink, Button, Menu, MenuItem, Avatar } from '@material-ui/core';

const CustomNavLink = styled(NavLink)({
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    fontWeight: 'bold',
    fontSize: 'x-large',
    fontFamily: 'Roboto',
    textTransform: 'capitalize',
    margin: '15px',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
        color: 'white',
        background: 'rgba(255, 255, 255, 0.1)',
        textDecoration: 'none',
        borderRadius: '15px',
    },
});
const CustomAvatar = styled(Avatar)({
    width: '60px',
    height: '60px',
    marginLeft: '15px'
});

export class LoginMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            userName: 'username',
            anchorEl: null
        };
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.populateState());
        this.populateState();
    }

    componentWillUnmount() {
        authService.unsubscribe(this._subscription);
    }

    async populateState() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
        this.setState({
            isAuthenticated,
            userName: user && user.name
        });
    }

    render() {
        const { isAuthenticated, userName } = this.state;
        if (!isAuthenticated) {
            const registerPath = `${ApplicationPaths.Register}`;
            const loginPath = `${ApplicationPaths.Login}`;
            return this.anonymousView(registerPath, loginPath);
        } else {
            const profilePath = `${ApplicationPaths.Profile}`;
            const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
            return this.authenticatedView(userName, profilePath, logoutPath);
        }
    }

    authenticatedView(userName, profilePath, logoutPath) {
        return (<Fragment>
            <CustomNavLink
                onClick={(event) => this.setState({ anchorEl: event.currentTarget })}
            >
                {userName}
                <CustomAvatar>{userName ? userName[0] : 'D'}</CustomAvatar>
            </CustomNavLink>
            <Menu
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={() => this.setState({ anchorEl: null })}
                style={{marginTop: '50px', marginLeft: '10px'}}
            >
                <MenuItem component={Link} to={profilePath}>Профиль</MenuItem>
                <MenuItem component={Link} to={logoutPath}>Выйти</MenuItem>
            </Menu>
        </Fragment>);

    }

    anonymousView(registerPath, loginPath) {
        return (<Fragment>
            <CustomNavLink component={Link} to={registerPath}>Регистрация</CustomNavLink>
            <CustomNavLink component={Link} to={loginPath}>Вход</CustomNavLink>
        </Fragment>);
    }
}
