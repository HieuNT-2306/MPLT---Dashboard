import React from 'react';
import { useState } from 'react';
import {Box, useMediaQuery} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import { useGetUserQuery } from 'state/api';



const Layout = () => {
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const userId = useSelector((state) => state.global.userId);
  const { data } = useGetUserQuery(userId);
  console.log('data', data);

  return (
    <Box display = {isNonMobile ?  "flex" : "block"} width="100%" height="100%">
      <Sidebar 
      user = {data || {} }
      isNonMobile={isNonMobile}
      drawerWidth={isNonMobile ? "250px" : 0}
      isSideBarOpen={isSideBarOpen} 
      setIsSideBarOpen={setIsSideBarOpen} /> 
      <Box flexGrow={1}>
        <Navbar 
          user = {data || {} }
          isSideBarOpen={isSideBarOpen} 
          setIsSideBarOpen={setIsSideBarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout;
