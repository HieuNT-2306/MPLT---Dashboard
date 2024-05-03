import React, { useState } from 'react'
import { Box, Input, InputAdornment, Paper, TableBody, TableCell, TableRow, Toolbar, useTheme } from '@mui/material'
import { useCreateCustomerMutation, useDeleteCustomerMutation, useGetCustomersQuery } from 'state/api'
import Header from 'components/Header'
import { DataGrid, viVN } from '@mui/x-data-grid'
import DataGridCustomToolbar from 'components/DataGridCustomToolbar'
import CustomerForm from './customerForm'
import CustomerFormTest from './customerFormTest'
import Usetable from 'components/Usetable'
import CustomInput from 'components/controls/CustomInput'
import { Add, Delete, Edit, Search } from '@mui/icons-material'
import CustomButton from 'components/controls/CustomButton'
import Popup from 'components/Popup'
import ActionButton from 'components/controls/ActionButton'

const headCells = [
    { id: 'name', label: 'Tên' },
    { id: 'email', label: 'Email' },
    { id: 'phonenumber', label: 'Số điện thoại' },
    { id: 'address', label: 'Địa chỉ' },
    { id: 'purchasevalue', label: 'Số tiền mua hàng' },
    { id: 'purchaseamount', label: 'Số lần mua hàng' },
    { id: 'createdAt', label: 'Ngày tạo', disableSorting: false },
    { id: 'actions', label: 'Actions', disableSorting: true },
];

const Customers = () => {
    const theme = useTheme();
    const { data } = useGetCustomersQuery();
    const [dataForEdit, setDataForEdit] = useState(null);
    const [createUser, { isLoading, error }] = useCreateCustomerMutation();
    const [deleteUser, { isLoading: isDeleting, error: deleteError }] = useDeleteCustomerMutation();
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [openPopup, setOpenPopup] = useState(false);
    // const [open, setOpen] = useState(false);
    // const [customerData, setCustomerData] = useState({ name: '', email: '', phonenumber: '', address: '' });

    const {
        TblContainer,
        TblHead,
        TblPagination,
        dataAfterPagingAndSorting
    } = Usetable(data, headCells, filterFn);

    const handleSearch = (e) => {
        const target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.name.toLowerCase().includes(target.value))
            }
        })
    }
    
    const addOrEdit = (customer, resetForm) => {
        console.log("customer", customer);

        //them truong hop edit customer

        createUser(customer);
        resetForm();
        setOpenPopup(false);
    }
    const openInPopup = (customer) => {
        console.log("customer for editing:", customer);
        setDataForEdit(customer);
        setOpenPopup(true);
    }

    //console.log("customer", data);

    const columns = [
        { field: 'name', headerName: 'Tên', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phonenumber', headerName: 'Số điện thoại', flex: 1 },
        { field: 'address', headerName: 'Địa chỉ', flex: 1 },
        {
            field: 'purchasevalue', headerName: 'Số tiền mua hàng', flex: 1,
            renderCell: (params) => {
                return (
                    <span>{params.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                )
            }
        },
        { field: 'purchaseamount', headerName: 'Số lần mua hàng', flex: 1 },
        {
            field: 'createdAt', headerName: 'Ngày tạo', flex: 0.8,
            renderCell: (params) => {
                return (
                    <span>{new Date(params.value).toLocaleDateString('vi-VN')}</span>
                )
            }
        },
    ];
    return (
        <Box m="0.5rem 1.5rem">
            <Header title="Khách hàng" subTitle="Danh sách khách hàng" />
            {/* <CustomerForm 
                customerinitData={{ name: 'Hello', email: 'helo123@gmail.com', phonenumber: '0123456789', address: '122332211ggdge' }}
            /> */}
            <Box
                margin={1}
                sx={{
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
                <Toolbar>
                    <CustomInput
                        label="Tìm kiếm khách hàng"
                        sx={{ width: '55%' }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        }}
                        onChange={handleSearch}
                    />
                    <CustomButton
                        text="Thêm khách hàng"
                        variant="outlined"
                        color="primary"
                        sx={{
                            marginLeft: 'auto',
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.secondary[100]
                        }}
                        onClick={() => setOpenPopup(true)}
                        startIcon= {<Add />}
                    />
                </Toolbar>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            data && dataAfterPagingAndSorting().map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.phonenumber}</TableCell>
                                    <TableCell>{row.address}</TableCell>
                                    <TableCell>{row.purchasevalue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                    <TableCell>{row.purchaseamount}</TableCell>
                                    <TableCell>{new Date(row.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell>
                                        <ActionButton
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => {openInPopup(row)}} 
                                        ><Edit/></ActionButton>
                                        <ActionButton
                                            variant="outlined"
                                            color="secondary"
                                        >
                                            <Delete/>
                                        </ActionButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
                <Popup
                    title="Thêm khách hàng"
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                >
                    <CustomerFormTest 
                        dataForEdit={dataForEdit}
                        addOrEdit={addOrEdit}
                    />
                </Popup>
                {/* {
                        data ? <DataGrid
                            loading={!data}
                            getRowId={(row) => row._id}
                            rows={data || []}
                            columns={columns}
                            slots={{ toolbar: DataGridCustomToolbar }}
                            density='compact'
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                        /> : <h1>Đang tải...</h1>
                    } */}
            </Box>
        </Box>
    )
}

export default Customers
