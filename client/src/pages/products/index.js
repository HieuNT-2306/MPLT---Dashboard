import React, { useState } from 'react';
import { Box, Card, CardActions, CardContent, Collapse, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import Header from 'components/Header';
import { useGetProductsQuery } from 'state/api';
import FlexBetween from 'components/FlexBetween';

const Product = ({
    _id,
    brand,
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
                    {Number(price).toFixed(0)}VND
                </Typography>
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
                        Doanh số bán năm nay: {productStat[0].yearlySalesTotal} VNĐ
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
};

function Products() {
    const { data, isLoading } = useGetProductsQuery();
    console.log("product", data);
    const isNonMoble = useMediaQuery("(min-width:900px)")
    return (
        <Box m="0.5rem 1.5rem">
            <Header title="Sản phẩm" subTitle="Xem danh sách sản phẩm" />
            {data ? (
                <Box
                    mt="1rem"
                    display="grid"
                    gridTemplateColumns="repeat(4,minmax(0,1fr))"
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
                        data.map(({
                            _id,
                            name,
                            price,
                            description,
                            category,
                            brand,
                            supply,
                            productStat
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
                            />
                        ))
                    }
                </Box>
            ) : <h1>Đang tải...</h1>}
        </Box>
    )
}

export default Products
