import { useTheme } from "@emotion/react";
import { Box, Grid, Paper, TextField } from "@mui/material";
import { Useform, FormCustom } from "components/Useform";
import CustomButton from "components/controls/CustomButton";
import CustomInput from "components/controls/CustomInput";
import React, { useState, useEffect } from "react";
import { useGetCustomersQuery, useGetProductsQuery, usePostTransactionMutation } from "state/api";

const initialValue = {
    userId: "",
    product: "",
};



export default function TransactionsForm(props) {
    const { addOrEdit, dataForEdit } = props;
    const { data: customerData } = useGetCustomersQuery();
    console.log("Customer data:", customerData );
    const customerSuggestion = customerData && customerData.map((customer) => {
        return {
            id: customer._id,
            name: customer.name,
            email: customer.email
        }
    });
    const { data: productData } = useGetProductsQuery();
    console.log("Product data:", productData );
    const productSuggestion = productData && productData.map((product) => {
        return {
            id: product._id,
            name: product.name,
            price: product.price
        }
    });

    const theme = useTheme();

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
    const styles = {
        inputtext50: {
            width: "85%",
            margin: "8px"
        },
        pageContent: {
            margin: "5px",
            padding: "3px",
            backgroundColor: theme.palette.background.default,
        },
        customButton: {
            margin: "8px"
        }
    };

    const {
        values,
        setValues,
        resetForm,
        errors,
        setErrors,
        handleInputChange
    } = Useform(initialValue, true, validate);

    const handleSubmit = () => {

    }

  return (
    <FormCustom onSubmit={handleSubmit}>
        
    </FormCustom>
  )
}
