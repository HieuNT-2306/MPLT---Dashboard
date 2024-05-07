import { Box, InputAdornment, Table, TableBody, TableCell, TableContainer, TableRow, Toolbar, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useGetCustomersQuery, useGetTransactionsQuery, usePostTransactionMutation } from 'state/api';
import Header from 'components/Header';
import CustomInput from 'components/controls/CustomInput';
import { Add, Delete, Edit, Search } from '@mui/icons-material';
import CustomButton from 'components/controls/CustomButton';
import Usetable from 'components/Usetable';
import ActionButton from 'components/controls/ActionButton';
import Popup from 'components/Popup';
import TransactionsForm from './transactionsForm';
import TransactionsFormTest from './transactionsFormTest';

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
    const {data } = useGetTransactionsQuery({ page, pageSize, sort: JSON.stringify(sort), search: "" });
    const [postTransactions, { isLoading, error }] = usePostTransactionMutation();


    console.log("transaction", data);
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
                    onClick={() => setOpenPopup(true)}
                />
            </Toolbar>
            <TblContainer>
                <TblHead />
                <TableBody>
                    {
                        data && dataAfterPagingAndSorting().map((row) => (
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
                                        onClick={() => console.log("View detail")}
                                    >
                                        <Edit />
                                    </ActionButton>
                                    <ActionButton
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => console.log("Delete")}
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

        </Box>
      
    </Box>
  )
}

export default Transaction
