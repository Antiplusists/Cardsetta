import { Link } from 'react-router-dom';
import { LoginMenu } from '../api-authorization/LoginMenu';
import './NavMenu.css';

import { createStyles, makeStyles, Theme, fade } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { Link as NavLink } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: '10%',
      width: '300px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
    },
    searchIcon: {
      height: '100%',
      padding: theme.spacing(0, 2),
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      width: '235px',
      height: '40px',
      padding: theme.spacing(1, 2, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    },
    logo: {
      height: '100px',
      margin: '10px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginRight: '-50%',
      transform: 'translate(-50%, -70%)',
      '&:active': {
        transform: 'translate(-50%, -72%)',
      },
    },
    logoImg: {
      height: '100px',
      margin: '10px',
    },
    header: {
      height: '125px',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#253C88',
    },
  }));

export default function NavMenu() {
  const classes = useStyles();
  return (
    <AppBar className={classes.header} position="static">
      <Toolbar>
        <NavLink className={classes.logo} component={Link} to="/" color="inherit" >
          <img className={classes.logoImg} src="/images/logo/logo_white.svg" alt="logo" />
        </NavLink>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Поиск…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>

        <div className={classes.grow} />

        <LoginMenu />

      </Toolbar>
    </AppBar>
  );
}