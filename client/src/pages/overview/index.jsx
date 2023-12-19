import React, { useState } from 'react'
import OverviewChart from "components/OverviewChart";
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Header from 'components/Header';

const Overview = () => {
    const [view, setView] = useState('units');

  return (
    <Box m='0.5rem 1.5rem'>
      <Header title="Tổng quan" subTitle="Tổng quan về doanh thu"/>
      <Box height="75vh">
        <FormControl sx={{
            marginTop: '1rem',
        }}>
            <InputLabel>Xem</InputLabel>
            <Select value={view} label="View" onChange={(e) => setView(e.target.value)}>
                <MenuItem value="units">Số lượng</MenuItem>
                <MenuItem value="sales">Doanh thu</MenuItem>
            </Select>
        </FormControl>
        <OverviewChart view={view}/>
      </Box>
    </Box>
  )
}

export default Overview;
