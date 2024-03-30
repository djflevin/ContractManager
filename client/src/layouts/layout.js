import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import router_config from '../router/RouterConfig';

import Avatar from '@mui/material/Avatar';
import stringAvatar from '../components/utils/Avatar';

import { useAuthUser } from 'react-auth-kit'
import { useSignOut } from 'react-auth-kit'
import { Outlet, useNavigate } from "react-router-dom";
import { authorise_url } from '../auth/auth';
import { useAuthHeader } from 'react-auth-kit'

import axios from 'axios';
// import MailIcon from '@mui/icons-material/Mail';
import * as mui from '@mui/material';
import * as muiIcons from '@mui/icons-material';

import {
  Link,
} from "react-router-dom";


export default function ClippedDrawer({ children }) {
  const [currentPage, setCurrentPage] = React.useState(0);
  const auth = useAuthUser()
  const signOut = useSignOut()
  const authHeader = useAuthHeader()
  const navigate = useNavigate()

  // Before layout is rendered, set auth header for all requests to API
  React.useEffect(() => {
    axios.defaults.headers.common['Authorization'] = authHeader()
    // Set Interceptor to handle 403 errors (unauthorised) and redirect to login page 
    axios.interceptors.response.use((response) => {
      if (response.status === 401) {
        signOut()
        navigate('/login')
      }
      return response
    }, (error) => {
      if (error.response.status === 401) {
        signOut()
        navigate('/login')
      }
      return Promise.reject(error)
    });
  }, [authHeader, auth, signOut, navigate])

  React.useEffect(() => {
    setCurrentPage(0);
  }, []);

  const drawerWidth = 230;
  const links = router_config.layout_links;


  const handleListItemClick = (event, index) => {
    setCurrentPage(index);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Highlight the current page in the sidebar
  const isCurrentPage = (link) => {
    if (link.link === window.location.pathname) {
      return true;
    }
    return false;
  };


  return (
    <Box sx={{ display: 'flex' }} >
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1001 }} elevation={0}>
        <Toolbar >
          <Typography variant="h6" noWrap component="div">
            UCL Contract Management
          </Typography>
          {/* Avatar alligned project right side of Toolbar */}
          {/* Check if User is signed in , if so display avatar */}
          <Box sx={{ flexGrow: 1 }} />
          {
            auth() ?
              <React.Fragment>
                <Avatar {...stringAvatar(auth().fullName)}
                  onClick={handleClick}
                  style={{ cursor: 'pointer' }}
                // Give Black border to avatar
                />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => {
                    signOut();
                    window.location.reload();
                    handleClose();

                  }}>
                    <ListItemIcon>
                      <muiIcons.ExitToApp />
                    </ListItemIcon>
                    Logout

                  </MenuItem>
                </Menu>
              </React.Fragment>
              :
              <Box sx={{ flexGrow: 1 }} />
          }

        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: 1000,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {links.map((link, index) => (
              <ListItem disablePadding key={link.name} style={{ width: '100%' }}>
                {/* React Link to route to different pages */}
                {/* <Link to={link.link} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}> */}
                <Link
                  to={link.link}
                  style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                  onClick={(event) => handleListItemClick(event, index)}
                >
                  <ListItemButton selected={isCurrentPage(link)}>
                    <ListItemIcon>
                      {link.icon}
                    </ListItemIcon>
                    <ListItemText primary={link.name} />
                  </ListItemButton>
                </Link>
              </ListItem>

            ))}
            <Divider />
          </List>

          <Box sx={{ flexGrow: 1 }} />
          {/* Logout Button alligned to bottom (only show if logged in)*/}
          {auth() ?
            <ListItem disablePadding style={{ position: 'absolute', bottom: 0 }}>
              <ListItemButton onClick={() => {
                signOut()
                window.location.reload()
              }}>
                <ListItemIcon>
                  <muiIcons.ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
            :
            <ListItem disablePadding style={{ position: 'absolute', bottom: 0 }}>
              <ListItemButton onClick={() => {
                window.open(authorise_url, '_self');
              }}>
                <ListItemIcon>
                  <muiIcons.Login />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          }
        </Box>
      </Drawer>

      <Box
        overflow-y="scroll"
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
        maxWidth="80%"
        marginLeft={1}
        marginRight="auto"
        bgcolor="background.default">
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}