import React, { useState } from 'react';
import { LightModeOutlined, DarkModeOutlined, Menu as MenuIcon, Search, SettingsOutlined, ArrowDropDownOutlined } from '@mui/icons-material';
import FlexBetween from './FlexBetween';
import { useDispatch } from 'react-redux';
import { setMode } from 'state';
import { AppBar, Button, IconButton, InputBase, Menu, MenuItem, Toolbar, Typography, useTheme } from '@mui/material';

const Navbar = ({  
  user,
  isSideBarOpen,
  setIsSideBarOpen}
) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      sx={{
        background: "none",
        boxShadow: "none",
        position: "static"
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        {/*Left*/}
        <FlexBetween>
          <IconButton onClick={() => {
            setIsSideBarOpen(!isSideBarOpen);
          }}> <MenuIcon /></IconButton>
          <FlexBetween backgroundColor={theme.palette.background.alt}
            sx={{
              borderRadius: "9px",
              padding: "8px 8px",
              gap: "3rem",
              padding: "0.1rem 1.5rem",
            }}
          >
            <InputBase placeholder='Tìm kiếm...' sx={{ flexbasis: "30%" }} />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>
        {/*Left*/}

        {/*Right*/}
        <FlexBetween>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? <LightModeOutlined sx={{fontSize:  "25px"}}/> : <DarkModeOutlined sx={{fontSize:  "25px"}}/>}
          </IconButton>
          <IconButton>
            <SettingsOutlined sx={{fontSize:  "25px"}} />
          </IconButton>
          <FlexBetween> 
            <Button onClick={handleClick} sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textTransform: "none",
              gap: "0.5rem",
            }}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: theme.palette.secondary[200],
                }}  
              >Xin chào, {user.name}
                </Typography>
              <ArrowDropDownOutlined sx={{fontSize:  "25px"}} />
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} 
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            >
              <MenuItem onClick={handleClose}>Đăng xuất</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
        {/*Right*/}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
