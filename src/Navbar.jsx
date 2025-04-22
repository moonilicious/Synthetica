import * as React from 'react';
import { useState, useEffect } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Button, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LogoImage from './logo.webp';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Stack from '@mui/material/Stack';
import Rectangle19 from './Rectangle 19.webp';
import { collection, query, where, getDocs } from "firebase/firestore";



const pages = ['Pricing', 'Token'];
const mobilepages = ['Pricing', 'History','Token', 'Educator'];
function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElModels, setAnchorElModels] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);
        const uid = user.uid;
        const usersCollectionRef = collection(db, "users");
        try {
          const q = query(usersCollectionRef, where("uid", "==", uid));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setUsername(doc.data().username); // Assuming 'username' is the field with user's name
          });
        } catch (error) {
          console.error("Error fetching user documents:", error);
        }
      } else {
        setLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModelsMenu = (event) => {
    setAnchorElModels(event.currentTarget);
  };

  const handleCloseModelsMenu = () => {
    setAnchorElModels(null);
  };

  const handleModelSelect = (model) => {
    navigate(`/${model}`);
    handleCloseModelsMenu();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const appBarStyle = {
    backgroundColor: 'black',
    backgroundSize: 'cover',
    justifyContent: 'right',
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = (
    <Box
      sx={{ 
        width: 250,
        bgcolor: 'black', // Black background for the entire body
        color: 'white', // White text
        height: '100%', // Ensure it covers the full height of the drawer
        '& .MuiListItem-root': { // Styles for ListItem
          borderBottom: '1px solid white', // White thin lines
          '&:last-child': { // Remove border for last item
            borderBottom: 'none',
          },
        },
        '& .MuiListItemText-primary': { // Ensure text is white
          color: 'white',
        },
        '& .MuiDivider-root': { // Divider style
          borderColor: 'white',
        }
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        {mobilepages.map((page) => (
          <ListItem button key={page} component={Link} to={`/${page.toLowerCase()}`}>
            <ListItemText primary={page} />
          </ListItem>
        ))}
        {loggedIn && (
          <ListItem button onClick={handleOpenModelsMenu}>
            <ListItemText primary="Models" />
          </ListItem>
        )}
        <Divider />
        {loggedIn ? (
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        ) : (
          <ListItem button component={Link} to="/login">
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );  

  return (
    <AppBar position="static" sx={appBarStyle}>
      <Toolbar disableGutters>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawerList}
            </Drawer>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <img src={LogoImage} alt="Logo" style={{ width: '54px', height: '54px', marginRight: '10px' }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
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
              SYNTHETICA
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Stack direction="row" spacing={5}>
            <Button
              component={Link}
              to={`/educator`}
              sx={{ my: 2, color: 'white', display: 'block', textTransform: 'uppercase', fontSize: '14px', fontWeight: 600 }}
            >
              Tools
            </Button>
            {pages.map((page) => (
              <Button
                key={page}
                component={Link}
                to={`/${page.toLowerCase()}`}
                sx={{ my: 2, color: 'white', display: 'block', textTransform: 'uppercase', fontSize: '14px', fontWeight: 600 }}
              >
                {page}
              </Button>
            ))}
            {loggedIn && (
              <Button
                onClick={handleOpenModelsMenu}
                sx={{ my: 2, color: 'white', display: 'block', textTransform: 'uppercase', fontSize: '14px', fontWeight: 600 }}
              >
                Models
              </Button>
            )}
            <Menu
              anchorEl={anchorElModels}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElModels)}
              onClose={handleCloseModelsMenu}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: 'black',
                },
              }}
            >
              <MenuItem
                onClick={() => handleModelSelect('essay-detector')}
                sx={{ color: 'white' }}
              >
                Essay
              </MenuItem>
              <MenuItem
                onClick={() => handleModelSelect('poem-detector')}
                sx={{ color: 'white' }}
              >
                Poem
              </MenuItem>
            </Menu>
          </Stack>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {loggedIn ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                position: 'relative',
                cursor: 'pointer',
                marginRight: '10px',
                className: 'ParentUsername'
              }}
            >
              <img src={Rectangle19} className='usernameimg' alt={userName} style={{ height: 'auto' }} />
              <Typography
                sx={{
                  position: 'absolute',
                  className: 'username',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {userName}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                cursor: 'pointer',
                marginRight: '10px',
              }}
              onClick={handleLogout}
            >
              <img src={Rectangle19} alt="Logout" className='log' style={{height: 'auto' }} />
              <Typography
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Logout
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              position: 'relative',
              cursor: 'pointer',
              marginRight: '10px',
            }}
            component={Link}
            to="/login"
          >
            <img src={Rectangle19} alt="Login" style={{ width: '150px', height: 'auto' }} />
            <Typography
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Login
            </Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;