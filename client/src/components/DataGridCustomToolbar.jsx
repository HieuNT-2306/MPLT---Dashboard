import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid'
import React from 'react'
import FlexBetween from './FlexBetween'
import { IconButton, InputAdornment, TextField, useTheme } from '@mui/material'
import { Search } from '@mui/icons-material'

const DataGridCustomToolbar = ({searchInput, setSearchInput, search, setSearch}) => {
    const theme = useTheme();
    const buttonStyle = {
        color: theme.palette.secondary[500]
    }
  return (
    <GridToolbarContainer>
      <FlexBetween width="100%">
        <FlexBetween>
            <GridToolbarColumnsButton sx={buttonStyle} />
            <GridToolbarDensitySelector sx={buttonStyle} defaultValue='compact'/>
            <GridToolbarExport sx={buttonStyle}/>
        </FlexBetween>
        <TextField 
            label="Tìm kiếm..."
            sx={{ mb: "0.5rem", width: "15rem" }}
            onChange={(e) => {
                setSearchInput(e.target.value);
                    
            }}
            value={searchInput}
            InputProps={{
                endAdornment: (
                    <InputAdornment position='end'>
                        <IconButton onClick={() => {
                            setSearch(searchInput);
                            setSearchInput("");
                        }}>
                            <Search /> 
                        </IconButton>
                    </InputAdornment>
                )
            }}
        >
            <InputAdornment position='end'>
                        <IconButton onClick={() => {
                            setSearch(searchInput);
                            setSearchInput("");
                            console.log(searchInput);
                        }}>
                            <Search /> 
                        </IconButton>
                    </InputAdornment>
        </TextField>
      </FlexBetween>
    </GridToolbarContainer>
  )
}

export default DataGridCustomToolbar;
