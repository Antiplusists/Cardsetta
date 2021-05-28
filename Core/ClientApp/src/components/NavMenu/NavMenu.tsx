import { Link } from 'react-router-dom';
import { LoginMenu } from '../api-authorization/LoginMenu';
import './NavMenu.css';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import authService from '../api-authorization/AuthorizeService';
import {useEffect, useRef, useState} from 'react';
import { ButtonLink } from '../CustomButtons/ButtonLink';

export default function NavMenu() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    
    const _subscribeId = authService.subscribe(async () => {
      setIsAuthenticated(authService.isAuthenticated());
    });
    return () => authService.unsubscribe(_subscribeId);
  }, []);
  
  return (
    <AppBar className='header' position='static'>
      <Toolbar>
        <Link className='logo' to="/" >
          <img src="/images/logo/logo_white.svg" alt="logo" />
        </Link>
        {isAuthenticated ?
          <ButtonLink>
            <Link to='/custom-cardsets'>Мои наборы</Link>
          </ButtonLink>
          : ''}
        <div className='grow' />
        <LoginMenu />
      </Toolbar>
    </AppBar>
  );
}