import { Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import React from "react";
import { useGetProductsQuery } from "state/api";

const Header = ({ title, subTitle }) => {
    const theme = useTheme();
    return (
        <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>{title}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: theme.palette.secondary.main }}>{subTitle}</Typography> 
        </Box>
    )
}
export default Header;