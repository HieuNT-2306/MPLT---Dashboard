import { useTheme } from '@emotion/react'
import { Box, Typography } from '@mui/material'
import BreakdownChart from 'components/BreakdownChart'
import Header from 'components/Header'
import React from 'react'

const Breakdown = () => {
    const theme = useTheme();
    return (
        <Box m="0.5rem 1.5rem">
            <Header title="Phân tích trong ngày" />
            <Box sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "1.5rem 0",
            }}>
                <Box height="75vh" width="50%">
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>Theo doanh thu:</Typography>
                    <BreakdownChart isSales />
                </Box>
                <Box height="75vh" width="50%">
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>Theo số lượng:</Typography>
                    <BreakdownChart isUnits />
                </Box>
            </Box>
         </Box>
    )
}

export default Breakdown
