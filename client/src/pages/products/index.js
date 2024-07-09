import React, { useState } from 'react';
import { Box, Card, CardActions, CardContent, Collapse, Button, Typography, useTheme, useMediaQuery, Toolbar, InputAdornment } from '@mui/material';
import Header from 'components/Header';
import { useDeleteProductMutation, useGetBrandsQuery, useGetCategoriesQuery, useGetProductsQuery, usePostProductMutation } from 'state/api';
import FlexBetween from 'components/FlexBetween';
import CustomInput from 'components/controls/CustomInput';
import { Add, Search } from '@mui/icons-material';
import Usetable from 'components/Usetable';
import CustomButton from 'components/controls/CustomButton';
import Popup from 'components/Popup';
import ProductForm from './productForm';
import Notification from 'components/Notification'
import ConfirmDialog from 'components/ConfirmDialog'

const Product = (
    // {_id,
    // brand,
    // img,
    // name,
    // price,
    // description,
    // category,
    // supply,
    // productStat}
   {product, openInPopup, categories, brands, onDelete}
) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const { _id, brand, img, name, price, description, category, supply, productStat } = product;
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

    const getCategoryName = (categoryId) => {
        if (!categories) return '';
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.name : '';
    };

    const getBrandName = (brandId) => {
        if (!brands) return '';
        const brand = brands.find(br => br._id === brandId);
        return brand ? brand.name : '';
    };

    return (
        <Card
            sx={{
                backgroundImage: "none",
                baclground: theme.palette.primary[700],
                borderRadius: "0.5rem"
            }} 
        >
            <CardContent>
                <FlexBetween>
                    <Typography sx={{
                        fontSize: 14,
                    }}
                        color={theme.palette.secondary[200]}
                        gutterBottom
                    >
                        {getCategoryName(category)}
                    </Typography>
                    <Typography sx={{
                        fontSize: 14,
                    }}
                        color={theme.palette.secondary[200]}
                        gutterBottom
                    >
                        {getBrandName(brand)}
                    </Typography>
                </FlexBetween>
                <Typography variant="h5" component="div"
                    sx={{
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                        maxWidth: "100%",
                    }}
                >
                    {name}
                </Typography>
                <Typography sx={{
                    marginBottom: "1.5rem"
                }} color={theme.palette.secondary[400]}>
                    {(price).toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})}
                </Typography>
                <img src={img} alt={name} style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", border: "1px solid blue" }} />
                <Typography variant="body2">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    onClick={() => openInPopup(product)}
                    sx={{
                        color: theme.palette.neutral[200],
                    }}
                >
                    Xem thêm                    
                </Button>
                <Button size="small"
                    sx={{
                        color: "red",
                    }}
                    onClick={() => {
                        console.log("._id", product._id);
                        setConfirmDialog({
                            isOpen: true,
                            title: `Bạn chắc chắn muốn xóa sản phẩm ${name} không?`,
                            subTitle: 'Bạn không thể hoàn tác hành động này',
                            onConfirm: () => {onDelete(product)}
                        })
                    }}
                >Xóa</Button>
            </CardActions>
            <ConfirmDialog 
                    confirmDialog={confirmDialog}
                    setConfirmDialog={setConfirmDialog}
                />
        </Card>
    )
};

function Products() {
    const { data, isLoading } = useGetProductsQuery();
    const [postProduct] = usePostProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const theme = useTheme();
    const isNonMoble = useMediaQuery("(min-width:900px)")
    const [sort, setSort] = useState({ });
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [dataForEdit, setDataForEdit] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);
    const { data: categories, isLoading: isLoadingCategories } = useGetCategoriesQuery();
    const { data: brands, isLoading: isLoadingBrands } = useGetBrandsQuery();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const {
        TblPagination,
        dataAfterPagingAndSorting,
    } = Usetable(data, null, filterFn);

    const handleSearch = (e) => {
        const target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "") {
                    return items;
                } else {
                    return items.filter(x => x.name.toLowerCase().includes(target.value.toLowerCase()));
                }
            }
        });
    }
    const addOrEdit = async (product, resetForm) => {
        console.log("product at editing:", product);
        const response = await postProduct(product);
        
        if (response.data.message === "Add product successfully") {
            setNotify({
                isOpen: true,
                message: "Thêm sản phẩm thành công",
                type: "success"
            });
        } else if (response.data.message === "Update product successfully") {
            setNotify({
                isOpen: true,
                message: "Cập nhật sản phẩm thành công",
                type: "success"
            });
        } else {
            setNotify({
                isOpen: true,
                message: `Có lỗi sảy ra, xin vui lòng thử lại hoặc báo với admin, lỗi: ${response.data.message}`,
                type: "error"
            });
        }        
        resetForm();
        setOpenPopup(false);
    }

    const openInPopup = (product) => {
        console.log("Product for editing: ", product);
        setDataForEdit(product);
        setOpenPopup(true);
    }
    const onDelete = async (product) => {
        const response = await deleteProduct(product._id);
        if (response.data.message === "Product deleted successfully") {
            setNotify({
                isOpen: true,
                message: "Xóa sản phẩm thành công",
                type: "success"
            });
        } else {
            setNotify({
                isOpen: true,
                message: `Xóa sản phẩm thất bại, lỗi: ${response.data.message}`,
                type: "error"
            });
        }
    }

    return (
        <Box m="0.5rem 1.5rem">
            <Header title="Sản phẩm" subTitle="Xem danh sách sản phẩm" />
            <Toolbar>
                <CustomInput
                    label="Tìm kiếm sản phẩm"
                    sx={{ width: '55%' }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    }}
                    onChange={handleSearch}
                />
                <CustomButton 
                    text="Thêm mặt hàng mới"
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
            {data ? (
                <Box
                    mt="1rem"
                    display="grid"
                    gridTemplateColumns="repeat(5,minmax(0,1fr))"
                    justifyContent="space-between"
                    rowGap="2rem"
                    columnGap="1.5%"
                    sx={{
                        "& > div": {
                            gridColumn: isNonMoble ? undefined : "span 4",
                        }
                    }}
                >
                    {
                        data && dataAfterPagingAndSorting(true).map((
                            product
                        ) => (
                            <Product

                                key={product._id}
                                product={product}
                                openInPopup={openInPopup}
                                onDelete={onDelete}
                                categories={categories}
                                brands={brands}
                            />
                        ))
                    }
                </Box>  
            ) : <h1>Đang tải...</h1>}
            <TblPagination />
            <Popup 
                title="Thêm mặt hàng mới"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                {/* <TransactionsForm /> */}
                <ProductForm
                    addOrEdit={addOrEdit}
                    dataForEdit={dataForEdit}
                    setOpenPopup={setOpenPopup}
                />
            </Popup>
            <Notification 
                    notify={notify}
                    setNotify={setNotify}
            />
        </Box>
    )
}

export default Products
