import React from 'react'
import { Box, useTheme } from '@mui/material'
import { useGetCustomersQuery } from 'state/api'
import Header from 'components/Header'
import { DataGrid, viVN } from '@mui/x-data-grid'
import DataGridCustomToolbar from 'components/DataGridCustomToolbar'

const Customers = () => {
    const theme = useTheme();
    const { data } = useGetCustomersQuery();
    console.log("customer", data);

    const columns = [
        { field: 'name', headerName: 'Tên', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phonenumber', headerName: 'Số điện thoại', flex: 1 },
        { field: 'address', headerName: 'Địa chỉ', flex: 1 },
        { field: 'purchasevalue', headerName: 'Số tiền mua hàng', flex: 1, 
            renderCell: (params) => {
                return (
                    <span>{params.value.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})}</span>
                )
            }},
        { field: 'purchaseamount', headerName: 'Số lần mua hàng', flex: 1},
        { field: 'createdAt', headerName: 'Ngày tạo', flex: 0.8 ,
            renderCell: (params) => {
                return (
                    <span>{new Date(params.value).toLocaleDateString('vi-VN')}</span>
                )
            }
        },
    ];
  return (
    <Box m="0.5rem 1.5rem">
        <Header title="Khách hàng" subTitle="Danh sách khách hàng"/>
        <Box
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
            {
                data ? <DataGrid
                loading={!data}
                getRowId={(row) => row._id}
                rows={data || []}
                columns={columns}
                slots={{toolbar: DataGridCustomToolbar}}
                density='compact'
                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}    
                /> : <h1>Đang tải...</h1>
            }
        </Box>
    </Box>
  )
}

export default Customers
