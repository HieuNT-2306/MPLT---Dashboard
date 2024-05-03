import { TextField } from '@mui/material';
import React from 'react'

export default function CustomInput(props) {
    const { name, label, value, onChange, error=null, sx, ...other } = props;

    return (
        <TextField
            variant="outlined"
            label={label}
            name={name}
            value={value}
            sx={sx}
            onChange={onChange}
            {...other}
            {...(error && {error:true, helperText: error})}
        />
    )
}
