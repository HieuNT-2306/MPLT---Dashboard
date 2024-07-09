import { FormControl, InputLabel, Menu, MenuItem, Select } from '@mui/material';
import React from 'react'

export default function SelectButton(props) {

    const { name, label, value, onChange, options, sx } = props;
  return (
    <FormControl
        variant='outlined'
        sx={sx}
    >
        <InputLabel>{label}</InputLabel>
        <Select 
            label={label}
            name={name}
            value={value}
            onChange={onChange}
        >
            {
                options && options.map(
                    item => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    )
                )
            }
            <MenuItem value=''>----Khác----</MenuItem>
        </Select>
    </FormControl>
  )
}
