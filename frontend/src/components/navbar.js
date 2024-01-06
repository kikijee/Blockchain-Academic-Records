import * as React from 'react';
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
import WidgetsIcon from '@mui/icons-material/Widgets';
import { Link, useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AuthDispatchContext } from '../context/AuthContext';
import { logout } from '../service/authService';

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [pages,setPages] = React.useState([['Record Search','/recordRequest'],['Sign Up','/register'],['Login','/login']])

  const auth = React.useContext(AuthContext)
  const authDispatch = React.useContext(AuthDispatchContext)

  const navigate = useNavigate();

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

  const logout_user =async()=>{
    const response = await logout()
    console.log(response)
    sessionStorage.removeItem('user')
    authDispatch({type:'reset'})
    navigate('/')
    window.location.reload(false);
  }

  React.useEffect(()=>{
    if(auth.user !== null){
      if(auth.user.Role === 'Admin' ){
        setPages(pages=>[['Admin Dashboard','/adminDashboard'],['Record Search','/recordRequest']])
      }
      else if(auth.user.Role === 'Institution' ){
        setPages(pages=>[['Institution Dashboard', '/institutionDashboard'],['Record Search','/recordRequest']])
      }
      else if(auth.user.Role === 'Student' ){
        setPages(pages=>[['Student Dashboard','/userDashboard'],['Record Request','/studentRecordRequest'],['Record Search','/recordRequest']])
      }
      else{
        setPages(pages=>[['Record Search','/recordRequest'],['Sign Up','/register'],['Login','/login']])
      }
    }
  },[auth])

  return (
    <AppBar position="static" sx={{ bgcolor: "#466b48" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        <WidgetsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href='/'
            sx={{
              mr: 10,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Blockchain EDU
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
                <MenuItem component={Link} key={page[0]} onClick={handleCloseNavMenu} to={page[1]}>
                  <Typography textAlign="center" >{page[0]}</Typography >
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
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
            href='/'
          >
            B-EDU
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button href={page[1]}
                key={page[0]}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page[0]}
              </Button>
            ))}
          </Box>
          { auth.user !== null &&
          <>
          <Typography marginRight={2} >{`${JSON.parse(sessionStorage.getItem('user')).FirstName} ${JSON.parse(sessionStorage.getItem('user')).LastName}`}</Typography>
          <Box sx={{ flexGrow: 0 }}>
             
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
              {/* <MenuItem key='profile' onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem> */}
              <MenuItem key='logout' onClick={()=>{
                logout_user()
                handleCloseUserMenu()
              }}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
          </>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export {ResponsiveAppBar}
