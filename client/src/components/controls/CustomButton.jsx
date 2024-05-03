import { Button } from '@mui/material';
import React from 'react'

export default function CustomButton(props) {
    const { text, size, color, variant, onClick, ...rest } = props;
    return (
        <Button
            variant={variant || "contained"}
            size={size || "large"}
            color={color || "primary"}
            onClick={onClick}
            {...rest}
        >
            {text}
        </Button>
    )
}
