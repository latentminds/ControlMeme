import * as React from 'react';
import TextField from '@mui/material/TextField'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import InputAdornment from '@mui/material/InputAdornment';
import { useContext } from 'react';

import AccountCircle from '@mui/icons-material/AccountCircle';

import "./ResponsiveAppBar.css"
import { SigninModal } from './SigninModale';
import { UserContext } from '../UserContext';
import { logout } from '../firebase/authCalls';

const pages = ['Browse', 'Generate', 'About'];
const settings = ['Anonymous Account', 'Coming Soon !'];

function ResponsiveAppBar(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [openModal, setOpenModal] = React.useState(false);

  const { user, setUser } = useContext(UserContext);

  console.log('user', user)


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div>
      <SigninModal open={openModal} onClose={() => { setOpenModal(false) }} />

      <AppBar position="static" style={{ background: '#fcfcfc' }} className="AppBar" elevation={0} >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img src="./android-chrome-384x384.png" sx={{ mr: 2 }}
              style={{ maxWidth: 'auto', maxHeight: '50px', marginRight: '10px' }} />

            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}

            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ControlMeme
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  //update current page state on click
                  <MenuItem key={page} onClick={() => {
                    props.setCurrentPage(page)
                  }}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ControlMeme
            </Typography>
            <Box sx={{ marginRight: "150px", flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: "center" }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => {
                    props.setCurrentPage(page)
                  }}
                  sx={{ my: 0, color: 'white', display: 'block', mx: 6 }}
                >

                  <Typography
                    variant="h6"
                    sx={{
                      mr: 2,
                      display: { xs: 'none', md: 'flex' },
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '.3rem',
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{ fontSize: "1em" }}>{page}</div>
                  </Typography>

                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>

              {user === null &&
                <button
                  color="white"
                  onClick={() => {
                    setOpenModal(true)
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '.3rem',
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{ fontSize: "1em" }}>Sign&nbsp;In</div>
                  </Typography>
                </button>
              }


              {user !== null &&
                <div>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="Remy Sharp" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem key={0} onClick={() => {
                      logout()
                      setUser(null);
                      handleCloseUserMenu()
                    }}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </div>
              }
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div >
  );
}
export default ResponsiveAppBar;