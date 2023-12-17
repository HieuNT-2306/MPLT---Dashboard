import { Box, Toolbar, useTheme } from '@mui/material';
import { DataGrid, viVN } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { useGetTransactionsQuery } from 'state/api';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import Header from 'components/Header';

const Transaction = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState({ });
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const {data, isLoading} = useGetTransactionsQuery({ page, pageSize, sort: JSON.stringify(sort), search });
    console.log("transaction", data);   
    const columns = [
        { field: 'userId.name', headerName: 'Tên khách hàng', flex: 1, valueGetter: (params) => params.row.userId.name  },
        { field: 'email', headerName: 'Email', flex: 1,  valueGetter: (params) => params.row.userId.email },
        { field: 'phonenumber', headerName: 'Số điện thoại', flex: 1,  valueGetter: (params) => params.row.userId.phonenumber },
        { field: 'products', headerName: 'Số sản phẩm mua', flex: 1, sortable: false,
            renderCell: (params) => {
                return (
                    <span>{params.value.length}</span>
                )
            } },
        { field: 'createdAt', headerName: 'Ngày mua', flex: 0.8 ,
            renderCell: (params) => {
                return (
                    <span>{new Date(params.value).toLocaleDateString('vi-VN')}</span>
                )
            }
        },
        { field: 'cost', headerName: 'Tổng tiền', flex: 1, 
            renderCell: (params) => {
                return (
                    <span>{params.value.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})}</span>
                )
        }},
    ]

  return (
    <Box margin="0.5rem 1.5rem">
        <Header title="Giao dịch" subTitle="Danh sách giao dịch"/>
        <Box
            height="80vh"
            sx ={{
                "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none"
                },
                "& .MuiDataGrid-columnHeader": {
                    backgroundColor: theme.palette.background.alt,
                    color: theme.palette.secondary[100],
                    fontWeight: 600
                },
                
            }}
        >
            <DataGrid
                loading={isLoading}
                getRowId={(row) => row._id}
                rows={(data && data.transactions) || []}
                columns={columns}
                pagination
                pageSize={pageSize}
                rowCount={(data && data.total) || 0}
                paginationMode='server'
                sortingMode='server'
                rowsPerPageOptions={[10, 20, 50]}
                onPageChange={(params) => setPage(params)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                onSortModelChange={(newSortModel) => setSort(...newSortModel)}
                slots={{toolbar: DataGridCustomToolbar}}  
                slotProps={{toolbar: {searchInput, setSearchInput, search, setSearch}}}
                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}            
            ></DataGrid>
        </Box>
      
    </Box>
  )
}

export default Transaction
