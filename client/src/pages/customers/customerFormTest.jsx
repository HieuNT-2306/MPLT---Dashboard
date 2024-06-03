import { useTheme } from "@emotion/react";
import { Box, Grid, Paper, TextField } from "@mui/material";
import { Useform, FormCustom } from "components/Useform";
import CustomButton from "components/controls/CustomButton";
import CustomInput from "components/controls/CustomInput";
import React, { useState, useEffect } from "react";

const initialValue = {
    name: "",
    email: "",
    phonenumber: "",
    address: "",
};


export default function CustomerFormTest(props) {
    const { addOrEdit, dataForEdit } = props;


    const theme = useTheme();
    const styles = {
        inputtext50: {
            width: "85%",
            margin: "8px"
        },
        pageContent: {
            margin: "5px",
            padding: "3px",
            backgroundColor: "#f9f9f9",
        },
        customButton: {
            margin: "8px"
        }
    };
    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("name" in fieldValues)
            temp.name = fieldValues.name ? "" : "Trường này không được để trống";
        if ("email" in fieldValues)
            temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email không hợp lệ";
        if ("phonenumber" in fieldValues)
            temp.phonenumber = fieldValues.phonenumber.length > 9 ? "" : "Số điện thoại không hợp lệ";
        if ("address" in fieldValues)
            temp.address = fieldValues.address ? "" : "Trường này không được để trống";
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            addOrEdit(values, resetForm);
        } 
    }
    useEffect(() => {
        if (dataForEdit != null) {
            setValues({
                ...dataForEdit
            });
        }
    }, [dataForEdit]);

    return (
            <FormCustom onSubmit={handleSubmit} sx={styles.pageContent}>
                <Grid container>
                    <Grid item xs={6}>
                        <CustomInput
                            label="Họ và tên"
                            name="name"
                            value={values.name}
                            onChange={handleInputChange}
                            sx={styles.inputtext50}
                            error={errors.name}
                        />
                        <CustomInput
                            label="Email"
                            name="email"
                            value={values.email}
                            onChange={handleInputChange}
                            sx={styles.inputtext50}
                            error={errors.email}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <CustomInput
                            label="Số điện thoại"
                            name="phonenumber"
                            value={values.phonenumber}
                            onChange={handleInputChange}
                            sx={styles.inputtext50}
                            error={errors.phonenumber}
                        />
                        <CustomInput
                            label="Địa chỉ"
                            name="address"
                            value={values.address}
                            onChange={handleInputChange}
                            sx={styles.inputtext50}
                            error={errors.address}
                        />
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
                    </Grid>
                </Grid>
            </FormCustom>
    )
}