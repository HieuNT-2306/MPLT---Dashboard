import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { Useform, FormCustom } from "components/Useform";
import CustomButton from "components/controls/CustomButton";
import CustomInput from "components/controls/CustomInput";
import Select from 'react-select';
import React, { useState, useEffect } from "react";
import { useGetCustomersQuery, useGetProductsQuery, usePostTransactionMutation } from "state/api";

const initialValue = {
    userId: null,
    product: [],
};


export default function TransactionsFormTest(props) {
    const { addOrEdit, dataForEdit } = props;
    console.log("Data for edit: ", dataForEdit);
    const { data: customerData } = useGetCustomersQuery();
    const { data: productData } = useGetProductsQuery();
    let newDataForEdit = {
        userId: {
            value: dataForEdit?.userId?._id,
            label: dataForEdit?.userId?.name,
            email: dataForEdit?.userId?.email,
            phonenumber: dataForEdit?.userId?.phonenumber,
        },
        products: dataForEdit?.products?.map((product) => ({
            value: product.productId._id,
            label: product.productId.name,
            price: product.productId.price,
            quantity: product.quantity,
        }))
    };
    console.log("newDataForEdit: ", newDataForEdit);

    const [selectedUser, setSelectedUser] = useState(newDataForEdit?.userId || null);
    const [selectedProducts, setSelectedProducts] = useState(newDataForEdit?.products || []);

    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("userId" in fieldValues)
            temp.userId = fieldValues.userId ? "" : "Trường này không được để trống";
        if ("product" in fieldValues)
            temp.product = fieldValues.product ? "" : "Trường này không được để trống";
        setErrors({
            ...temp
        });
        if (fieldValues === values)
            return Object.values(temp).every(x => x === "");
    }

    const {
        values,
        setValues,
        resetForm,
        errors,
        setErrors,
        handleInputChange
    } = Useform(initialValue, true, validate);

    const userOptions = customerData?.map((customer) => ({
        value: customer._id,
        label: customer.name,
        email: customer.email,
        phonenumber: customer.phonenumber,
    }));

    const productOptions = productData?.map((product) => ({
        value: product._id,
        label: product.name,
        price: product.price,
    }));
    

    const handleUserChange = (selectedOption) => {
        setSelectedUser(selectedOption);
        console.log("selectedUser: ", selectedOption);
    };

    const handleProductChange = (selectedOption) => {
        setSelectedProducts(selectedOption.map(option => ({ ...option, quantity: 1 })));
        console.log("selectedProducts: ", selectedOption);
    };

    const handleQuantityChange = (productId, quantity) => {
        setSelectedProducts(selectedProducts.map(product =>
            product.value === productId ? { ...product, quantity } : product
        ));
    };

    const handleProductRemove = (productId) => {
        setSelectedProducts(selectedProducts.filter(product => product.value !== productId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            userId: selectedUser.value,
            products: selectedProducts.map((product) => ({
                productId: product.value,
                quantity: parseInt(product.quantity),
            })),
        };
        console.log("payload", payload);
        addOrEdit(payload, resetForm);
    };


    const theme = useTheme();

    const styles = {
        selectInput: {
            control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? 'blue' : baseStyles.borderColor,
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.primary[100],
            }),
            option: (provided) => ({
                ...provided,
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.primary[100]
            }),
            singleValue: (provided) => ({
                ...provided,
                color: theme.palette.primary[100]
            }),
            multiValue: (provided) => ({
                ...provided,
                color: theme.palette.primary[100]
            }),
            input: (provided) => ({
                ...provided,
                color: theme.palette.primary[100]
            }),
        },

        customButton: {
            margin: "8px"
        },
        productBox: {
            border: "1px solid #ccc",
        }
    };


    return (
        <FormCustom onSubmit={handleSubmit}>
            <Box sx={styles.boxContent}>
                <Box>
                    <h3>Thêm khách hàng:</h3>
                    <Select
                        value={selectedUser}
                        onChange={handleUserChange}
                        options={userOptions}
                        placeholder="Chọn các khách hàng có sẵn..."
                        styles={styles.selectInput}
                        margin="8px"
                    />
                    {selectedUser && (
                        <div>
                            <h4>Khách hàng:</h4>
                            <p>Tên: {selectedUser.label}</p>
                            <p>Email: {selectedUser.email}</p>
                            <p>Số điện thoại: {selectedUser.phonenumber}</p>
                        </div>
                    )}
                </Box>
                <Box>
                    <h3>Thêm sản phẩm:</h3>
                    <Select
                        value={selectedProducts}
                        onChange={handleProductChange}
                        options={productOptions}
                        placeholder="Thêm sản phẩm..."
                        styles={styles.selectInput}
                        isMulti
                    />
                    <Box>
                        <h3>Sản phẩm thanh toán:</h3>
                        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", minHeight:"200px"  }}>
                        {selectedProducts.length > 0 && (
                            <>
                                {selectedProducts.map((product) => (
                                    <div key={product.value} style={{ width: '25%', boxSizing: 'border-box', padding: '10px' }}>
                                        <p>Tên: {product.label}</p>
                                        <p>Giá: {product.price}</p>
                                        {/* <input
                                            type="number"
                                            min={1}
                                            value={product.quantity}
                                            onChange={(e) => handleQuantityChange(product.value, e.target.value)}
                                        /> */}

                                        <CustomInput 
                                            label="Số lượng"
                                            name="quantity"
                                            value={product.quantity}
                                            onChange={(e) => handleQuantityChange(product.value, e.target.value)}
                                            sx={{width: "70%", margin: "8px"}}
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <CustomButton
                    variant="contained"
                    color="primary"
                    size="large"
                    text="Gửi"
                    type="submit"
                    sx={styles.customButton}
                />
                <CustomButton
                    variant="contained"
                    color="secondary"
                    size="large"
                    text="Hủy"
                    onClick={resetForm}
                    sx={styles.customButton}
                />
            </Box>
        </FormCustom>
    );

};
