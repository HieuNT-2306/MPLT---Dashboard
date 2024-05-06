import React, { useState } from 'react'
import { Box, Input, InputAdornment, Paper, TableBody, TableCell, TableRow, Toolbar, useTheme } from '@mui/material'
import { useCreateCustomerMutation, useDeleteCustomerMutation, useGetCustomersQuery } from 'state/api'
import Header from 'components/Header'
import CustomerFormTest from './customerFormTest'
import Usetable from 'components/Usetable'
import CustomInput from 'components/controls/CustomInput'
import { Add, Delete, Edit, Search } from '@mui/icons-material'
import CustomButton from 'components/controls/CustomButton'
import Popup from 'components/Popup'
import ActionButton from 'components/controls/ActionButton'
import Notification from 'components/Notification'
import ConfirmDialog from 'components/ConfirmDialog'

const headCells = [
    { id: 'name', label: 'Tên' },
    { id: 'email', label: 'Email' },
    { id: 'phonenumber', label: 'Số điện thoại' },
    { id: 'address', label: 'Địa chỉ' },
    { id: 'purchasevalue', label: 'Số tiền mua hàng' },
    { id: 'purchaseamount', label: 'Số lần mua hàng' },
    { id: 'createdAt', label: 'Ngày tạo'},
    { id: 'actions', label: 'Thao tác', disableSorting: true },
];

const Customers = () => {
    const theme = useTheme();
    const { data } = useGetCustomersQuery();
    
    const [dataForEdit, setDataForEdit] = useState(null);
    const [createUser, { isLoading, error }] = useCreateCustomerMutation();
    const [deleteUser, { isLoading: isDeleting, error: deleteError }] = useDeleteCustomerMutation();
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [openPopup, setOpenPopup] = useState(false);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
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
        createUser(customer);
        resetForm();
        setOpenPopup(false);
        if (customer._id) {
            setNotify({
                isOpen: true,
                message: 'Sửa thông tin khách hàng thành công',
                type: 'success'
            });
        }
        else  {
            setNotify({
                isOpen: true,
                message: 'Thêm khách hàng thành công',
                type: 'success'
            });
        }
    }
    const openInPopup = (customer) => {
        console.log("customer for editing:", customer);
        setDataForEdit(customer);
        setOpenPopup(true);
    }
    const onDelete = (id) => {
        setConfirmDialog({ ...confirmDialog, isOpen: false});
        console.log("id", id);
        deleteUser(id);
        setNotify({
            isOpen: true,
            message: 'Xóa khách hàng thành công',
            type: 'error'
        });
    }


    return (
        <Box m="0.5rem 1.5rem">
            <Header title="Khách hàng" subTitle="Danh sách khách hàng" />
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
                                            onClick={() => {
                                                console.log("row._id", row._id);
                                                setConfirmDialog({
                                                    isOpen: true,
                                                    title: `Bạn chắc chắn muốn xóa khách hàng ${row.name} không?`,
                                                    subTitle: 'Bạn không thể hoàn tác hành động này',
                                                    onConfirm: () => {onDelete(row._id)}
                                                })
                                                //onDelete(row._id)
                                            }}
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
                    title="Thêm / sửa khách hàng"
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                >
                    <CustomerFormTest 
                        dataForEdit={dataForEdit}
                        addOrEdit={addOrEdit}
                    />
                </Popup>
                <Notification 
                    notify={notify}
                    setNotify={setNotify}
                />
                <ConfirmDialog 
                    confirmDialog={confirmDialog}
                    setConfirmDialog={setConfirmDialog}
                />
            </Box>
        </Box>
    )
}

export default Customers
