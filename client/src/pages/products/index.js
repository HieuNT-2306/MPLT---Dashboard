import React, { useState } from 'react';
import { Box, Card, CardActions, CardContent, Collapse, Button, Typography, useTheme, useMediaQuery, Toolbar, InputAdornment } from '@mui/material';
import Header from 'components/Header';
import { useGetProductsQuery } from 'state/api';
import FlexBetween from 'components/FlexBetween';
import CustomInput from 'components/controls/CustomInput';
import { Add, Search } from '@mui/icons-material';
import Usetable from 'components/Usetable';
import CustomButton from 'components/controls/CustomButton';
import Popup from 'components/Popup';
import ProductForm from './productForm';

const Product = ({
    _id,
    brand,
    img,
    name,
    price,
    description,
    category,
    supply,
    productStat
}) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
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
                        {category}
                    </Typography>
                    <Typography sx={{
                        fontSize: 14,
                    }}
                        color={theme.palette.secondary[200]}
                        gutterBottom
                    >
                        {brand}
                    </Typography>
                </FlexBetween>
                <Typography variant="h5" component="div">
                    {name}
                </Typography>
                <Typography sx={{
                    marginBottom: "1.5rem"
                }} color={theme.palette.secondary[400]}>
                    {(price).toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})}
                </Typography>
                <img src={img} alt={name} style={{ width: "100%", height: "auto", border: "1px solid blue" }} />
                <Typography variant="body2">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    onClick={() => setIsExpanded(!isExpanded)}
                    sx={{
                        color: theme.palette.neutral[200],
                    }}
                >
                    {isExpanded ? "Thu gọn" : "Xem thêm"}
                </Button>
                <Button size="small"
                    sx={{
                        color: "red",
                    }}
                >Xóa</Button>
            </CardActions>
            <Collapse
                in={isExpanded}
                timeout="auto"
                unmountOnExit
                sx={{
                    color: theme.palette.neutral[200],
                }}
            >
                <CardContent>
                    <Typography >
                        Số lượng còn trong kho: {supply}
                    </Typography>
                    <Typography >
                        Số lượng bán năm nay: {productStat[0].yearlySalesUnits} sản phẩm
                    </Typography>
                    <Typography >
                        Doanh số bán năm nay: {(productStat[0].yearlySalesTotal).toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
};

function Products() {
    const { data, isLoading } = useGetProductsQuery();
    console.log("product", data);
    const theme = useTheme();
    const isNonMoble = useMediaQuery("(min-width:900px)")
    const [sort, setSort] = useState({ });
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [dataForEdit, setDataForEdit] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);

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
                        data && dataAfterPagingAndSorting(true).map(({
                            _id,
                            name,
                            price,
                            description,
                            category,
                            brand,
                            supply,
                            productStat,
                            img
                        }) => (
                            <Product
                                key={_id}
                                _id={_id}
                                name={name}
                                price={price}
                                description={description}
                                category={category}
                                brand={brand}
                                supply={supply}
                                productStat={productStat}
                                img={img}   
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
                />
            </Popup>
        </Box>
    )
}

export default Products
