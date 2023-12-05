import React from 'react';
import { useState } from 'react';
import {Box, useMediaQuery} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { UseSelector } from 'react-redux/es/hooks/useSelector';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';


const Layout = () => {
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  return (
    <Box display = {isNonMobile ?  "flex" : "block"} width="100%" height="100%">
      <Sidebar 
      isNonMobile={isNonMobile}
      drawerWidth={isNonMobile ? "250px" : 0}
      isSideBarOpen={isSideBarOpen} 
      setIsSideBarOpen={setIsSideBarOpen} /> 
      <Box>
        <Navbar 
          isSideBarOpen={isSideBarOpen} 
          setIsSideBarOpen={setIsSideBarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout;
