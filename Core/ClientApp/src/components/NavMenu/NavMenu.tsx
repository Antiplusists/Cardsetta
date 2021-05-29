import { Link } from 'react-router-dom';
import { LoginMenu } from '../api-authorization/LoginMenu';
import './NavMenu.css';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import authService from '../api-authorization/AuthorizeService';
import { useEffect, useState } from 'react';
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
      <Toolbar className='toolbar'>

        {isAuthenticated
          ?
          <div className='flexCenter' style={{ justifyContent: 'flex-start' }}>
            <ButtonLink>
              <Link to='/custom-decks'>Мои наборы</Link>
            </ButtonLink>
          </div>
          : ''
        }

        <div className={`flexCenter ${!isAuthenticated ? 'span2' : ''}`}>
          <TagInput />
        </div>

        <div className='flexCenter'>
          <Link className='logo' to='/' >
            <div className='logo-container'>
              <img src='/images/logo/logo_white.svg' alt='logo' />
              <img className='hov' src='/images/logo/logo_gold.svg' alt='logo' />
            </div>
          </Link>
        </div>

        <div></div>

        <div className='flexCenter' style={{ justifyContent: 'flex-end' }} >
          <LoginMenu />
        </div>
      </Toolbar>
    </AppBar >
  );
}