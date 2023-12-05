import React, { useState } from 'react';
import { LightModeOutlined, DarkModeOutlined, Menu as MenuIcon, Search, SettingsOutlined, ArrowDropDownOutlined } from '@mui/icons-material';
import FlexBetween from './FlexBetween';
import { useDispatch } from 'react-redux';
import { setMode } from 'state';
import { AppBar, IconButton, InputBase, Toolbar, useTheme } from '@mui/material';

const Navbar = ({  isSideBarOpen,
  setIsSideBarOpen}
) => {
  const dispatch = useDispatch();
  const theme = useTheme();

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
          <IconButton>
            <ArrowDropDownOutlined />
          </IconButton>
        </FlexBetween>
        {/*Right*/}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
