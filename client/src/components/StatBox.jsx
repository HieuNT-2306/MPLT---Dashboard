import { Box, Typography, useTheme } from '@mui/material';
import React from 'react'
import FlexBetween from './FlexBetween';

const StatBox = ({title, value, increase, icon, description}) => {
    const theme = useTheme();
  return (
    <Box
        gridColumn="span 2"
        gridRow="span 1"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        padding="1rem"
        flex="1 1 100%"
        backgroundColor={theme.palette.background.alt}
        borderRadius="0.55rem"
    >
        <FlexBetween>
            <Typography variant="h6" sx={{ color: theme.palette.secondary[100], whiteSpace: "nowrap"}} >{title}</Typography>
            {icon}
        </FlexBetween>
        <Typography variant="h3" fontWeight="600" sx={{ color: theme.palette.secondary[200]}} textAlign="center">{value}</Typography>
        <FlexBetween
            gap="1rem"
        >
            <Typography variant="h6" fontStyle="italic" sx={{ 
                color: increase > 0 ? "	#3f8f29" : "	#bf1029", 
            }}>{increase> 0 ? "+" : ""}{increase}%</Typography>
            <Typography variant="h6" fontSize="0.7rem" fontStyle="italic" sx={{ color: theme.palette.secondary.light}}>{description}</Typography>
        </FlexBetween>
    </Box>
  )
}

export default StatBox;
