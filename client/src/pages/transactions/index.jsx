import { Box, InputAdornment, TableBody, TableCell, TableRow, Toolbar, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useDeleteTransactionMutation, useGetTransactionsQuery, usePostTransactionMutation } from 'state/api';
import Header from 'components/Header';
import CustomInput from 'components/controls/CustomInput';
import { Add, Delete, Edit, Search } from '@mui/icons-material';
import CustomButton from 'components/controls/CustomButton';
import Usetable from 'components/Usetable';
import ActionButton from 'components/controls/ActionButton';
import Popup from 'components/Popup';
import TransactionsFormTest from './transactionsFormTest';
import Notification from 'components/Notification';
import ConfirmDialog from 'components/ConfirmDialog';

const headCells = [
    { id: 'userId.name', label: 'Tên khách hàng' },
    { id: 'userId.email', label: 'Email' },
    { id: 'userId.phonenumber', label: 'Số điện thoại' },
    { id: 'numberOfProducts', label: 'Số sản phẩm' },
    { id: 'purchaseamount', label: 'Tổng tiền' },
    { id: 'createdAt', label: 'Ngày mua'},
    { id: 'actions', label: 'Thao tác', disableSorting: true },
];

const Transaction = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState({ });
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [dataForEdit, setDataForEdit] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const {data } = useGetTransactionsQuery({ page, pageSize, sort: JSON.stringify(sort), search: "" });
    const [postTransactions, { isLoading, error }] = usePostTransactionMutation();
    const [deleteTransaction, { isLoading: isDeleting,  error: deletingError }] = useDeleteTransactionMutation();
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const {
        TblContainer,
        TblHead,
        TblPagination,
        dataAfterPagingAndSorting,
    } = Usetable(data, headCells, filterFn);

    const addOrEdit = (transaction, resetForm) => {
        console.log(transaction);
        postTransactions(transaction);
        resetForm();
        setOpenPopup(false);
        setNotify({
            isOpen: true,
            message: 'Thêm thanh toán thành công',
            type: 'success'
        });
    }
    const openInPopup = (transactions) => {
        console.log("Open in popup: ", transactions);
        setDataForEdit(transactions);
        setOpenPopup(true);
    }

    const handleSearch = (e) => {
        const target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.userId.name.toLowerCase().includes(target.value))
            }
        })
    }
    const onDelete = (id) => {
        setConfirmDialog({ ...confirmDialog, isOpen: false});
        console.log("Deleting id:", id);
        deleteTransaction(id);
        console.log("Deleting complete:", id);
        setNotify({
            isOpen: true,
            message: 'Xóa hóa đơn thành công',
            type: 'error'
        });
    }

  return (
    <Box margin="0.5rem 1.5rem">
        <Header title="Hóa đơn" subTitle="Danh sách hóa đơn"/>
        <Box
            height="80vh"
            margin={1}
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
            <Toolbar>
                <CustomInput 
                    label="Tìm kiếm giao dịch"
                    sx={{width: '55%'}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        )
                    }}
                    onChange={handleSearch}
                />
                <CustomButton 
                    text="Thêm hóa đơn"
                    variant="outlined"
                    color="primary"
                    sx={{
                        marginLeft: 'auto',
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.secondary[100]
                    }}
                    startIcon={<Add />}
                    onClick={() => {
                        setDataForEdit(null)
                        setOpenPopup(true)
                    }}
                />
            </Toolbar>
            <TblContainer>
                <TblHead />
                <TableBody>
                    {
                        data && dataAfterPagingAndSorting(true).map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>{row.userId.name}</TableCell>
                                <TableCell>{row.userId.email}</TableCell>
                                <TableCell>{row.userId.phonenumber}</TableCell>
                                <TableCell>{row.numberOfProducts}</TableCell>
                                <TableCell>{row.cost.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</TableCell>
                                <TableCell>{new Date(row.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell>
                                    <ActionButton 
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => openInPopup(row)}
                                    >
                                        <Edit />
                                    </ActionButton>
                                    <ActionButton
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => 
                                            {
                                                console.log("Delete", row._id);
                                                setConfirmDialog({
                                                    isOpen: true,
                                                    title: `Bạn chắc chắn muốn xóa hoán đơn của khách hàng ${row.userId.name}, tại ${Date(row.createdAt)} không?`,
                                                    subTitle: 'Bạn không thể hoàn tác hành động này',
                                                    onConfirm: () => {onDelete(row._id)}
                                                })
                                            }
                                        }
                                    >
                                        <Delete />
                                    </ActionButton>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </TblContainer>
            <TblPagination />
            <Popup 
                title="Thêm hóa đơn"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                {/* <TransactionsForm /> */}
                <TransactionsFormTest
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

export default Transaction
