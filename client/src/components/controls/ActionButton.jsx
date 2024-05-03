import { Button, useTheme } from '@mui/material';
import React from 'react'

export default function ActionButton(props) {
    const theme = useTheme();
    const { color, children, onClick } = props;

    const style = {
        root: {
            minWidth: 0,
            margin: "2px"
        },
        secondary: {
            backgroundColor: theme.palette.secondary.main,
            "& .MuiButton-label": {
                color: theme.palette.secondary.contrastText,
            },
        },
        primary: {
            backgroundColor: theme.palette.primary.main,
            "& .MuiButton-label": {
                color: theme.palette.primary.contrastText,
            },
        }
    }

    return (
        <Button
            variant="contained"
            sx={`style.${color}` }
            color={color}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}
