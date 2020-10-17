import {
  Button,
  createStyles,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { ExitToApp, Home, Note, NoteAdd } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { logout } from '../../Services/LoginService';

interface INavigationState {
  navigationOpen: boolean;
  navigationVisible: boolean;
}

export default function Navigation() {
  const history = useHistory();
  const location = useLocation();

  const [state, setState] = useState<INavigationState>({
    navigationOpen: true,
    navigationVisible: true,
  });

  const handleLogOut = () => logout(handleLogOutSuccess, handleLogOutError);
  const handleLogOutSuccess = () => history.push('/login');
  const handleLogOutError = (e: any) => toast.error(e.message);

  const classes = useStyles();
  const navigationLinks = NavigationLinks();

  // Checks if the navigation link matches the current route (will be rendered as active)
  const checkActive = (locationPath: string, linkPath: string) => {
    return locationPath.split('/')[1] === linkPath.split('/')[1];
  };

  return (
    <div className="navigation">
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: state.navigationOpen,
          [classes.drawerClose]: !state.navigationOpen,
          [classes.drawerNotVisible]: !state.navigationVisible,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: state.navigationOpen,
            [classes.drawerClose]: !state.navigationOpen,
            [classes.drawerNotVisible]: !state.navigationVisible,
          }),
        }}
      >
        <List classes={{ root: classes.list }}>
          {navigationLinks.map((link, index) => {
            const active = checkActive(location.pathname, link.path);
            return (
              <ListItem
                key={index}
                onClick={() => {
                  // dispatch(showNav(checkNavVisible()));
                  history.push(link.path);
                }}
                button
                className={clsx(classes.menuButtom, {
                  [classes.menuButtonActive]: active,
                  [classes.menuButtonInactive]: !active,
                })}
                classes={{
                  root: clsx({
                    [classes.menuButtonActive]: active,
                    [classes.menuButtonInactive]: !active,
                  }),
                }}
              >
                <ListItemIcon
                  classes={{
                    root: clsx({
                      [classes.menuIconActive]: active,
                      [classes.menuIconInactive]: !active,
                    }),
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            );
          })}
        </List>
        <List classes={{ root: classes.listBottom }}>
          <ListItem
            button
            onClick={handleLogOut}
            classes={{
              root: clsx(classes.menuButtom, classes.menuButtonExpand),
            }}
          >
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
          {/* <ListItem button onClick={handleDrawer} classes={{ root: clsx(classes.menuButtom, classes.menuButtonExpand) }}>
							<ListItemIcon>
								<Menu />
							</ListItemIcon>
						</ListItem> */}
        </List>
      </Drawer>
      <ToastContainer />
    </div>
  );
}

export interface LinkInterface {
  path: string;
  label: React.ReactNode;
  icon: React.ReactNode;
}

// Links for the navigation drawer
function NavigationLinks(): LinkInterface[] {
  return [
    { label: 'Dashboard', path: '/', icon: <Home /> },
    { label: 'My Notes', path: '/my-notes', icon: <Note /> },
    { label: 'Liked Notes', path: '/liked-notes', icon: <NoteAdd /> },
  ];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    // appBar: {
    // 	zIndex: theme.zIndex.drawer + 1,
    // },
    drawer: {
      width: '15rem',
      flexShrink: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      position: 'relative',
    },
    drawerOpen: {
      width: '20rem',
      position: 'relative',
      // width: "100%",
      height: '100%',
      boxShadow: '0px 4px 50px -2px #dddddd',
      background: '#f4f4f4',

      borderRight: 'none',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflow: 'hidden',
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      boxShadow:
        '0px 4px 50px -2px rgba(200, 230, 255, 0.3), -1px 2px 10px 0px rgba(200,200,200, 0.14), 0px 1px 5px 0px rgba(200,200,200,0.12) !important',
      borderRight: 'none',
      overflowX: 'hidden',
      width: '70px',
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
      overflow: 'hidden',
    },
    drawerNotVisible: {
      width: '0rem',
    },
    list: { margin: '0.5rem 1rem', height: '100%', overflow: 'hidden' },
    listBottom: {
      margin: '0.5rem 1rem',
      position: 'absolute',
      bottom: '10px',
      width: '90%',
    },
    menuButtom: {
      borderRadius: '1rem',
      marginBottom: '0.5rem',
      '& span': { fontFamily: "'Poppins', sans-serif" },
    },
    menuButtonActive: {
      background:
        'linear-gradient(171deg, rgba(81, 36, 122, 1) 0%, rgba(150, 42, 187, 1) 100%)',
      color: 'white',
    },
    menuButtonInactive: {
      transition: 'background-color 0.3s',
      '&:hover': { backgroundColor: 'rgb(235, 235, 235)' },
    },
    menuButtonExpand: { height: '48px' },
    menuIconActive: { color: 'white' },
    menuIconInactive: {},
  }),
);
