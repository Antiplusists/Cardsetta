import { Link } from 'react-router-dom';
import { LoginMenu } from '../api-authorization/LoginMenu';
import './NavMenu.css';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import authService from '../api-authorization/AuthorizeService';
import {useEffect, useState} from 'react';
import { ButtonLink } from '../CustomButtons/ButtonLink';
import TagInput from "../TagInput/TagInput";

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
        <TagInput />
        <div className='grow' />
        <LoginMenu />
      </Toolbar>
    </AppBar>
  );
}