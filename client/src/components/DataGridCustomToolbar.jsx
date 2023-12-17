import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid'
import React from 'react'
import FlexBetween from './FlexBetween'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import { Search } from '@mui/icons-material'

const DataGridCustomToolbar = ({searchInput, setSearchInput, search, setSearch}) => {
  return (
    <GridToolbarContainer>
      <FlexBetween width="100%">
        <FlexBetween>
            <GridToolbarDensitySelector/>
            <GridToolbarExport />
            <GridToolbarColumnsButton />
        </FlexBetween>
        <TextField 
            label="Tìm kiếm..."
            sx={{ mb: "0.5rem", width: "15rem" }}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            inputProps={{
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

        </TextField>
      </FlexBetween>
    </GridToolbarContainer>
  )
}

export default DataGridCustomToolbar
