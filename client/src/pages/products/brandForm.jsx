import { useTheme } from "@emotion/react";
import { Box, Grid, Paper, TextField } from "@mui/material";
import { Useform, FormCustom } from "components/Useform";
import CustomButton from "components/controls/CustomButton";
import CustomInput from "components/controls/CustomInput";
import React, { useState, useEffect } from "react";
import { usePostBrandMutation } from "state/api";
import Notification from 'components/Notification'

const initialValue = {
    name: "",
};

export default function BrandForm(props) {
    const { dataForEdit } = props;
    const [postBrand] = usePostBrandMutation();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const theme = useTheme();
    const styles = {
        inputtext50: {
            width: "85%",
            margin: "8px"
        },
        pageContent: {
            margin: "5px",
            padding: "3px",
            backgroundColor: "",
        },
        customButton: {
            margin: "8px"
        }
    };
    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("name" in fieldValues)
            temp.name = fieldValues.name ? "" : "Trường này không được để trống";
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

    const handleBrandSubmit = async (e) => {
        console.log("values", values);
        const response = await postBrand(values);
        console.log("response", response);
        try {
            setNotify({
                isOpen: true,
                message: `Thêm nhãn hàng mới ${response.data.name} thành công`,
                type: "success"
            });
        } catch (error) {
            console.log(error)
            setNotify({
                isOpen: true,
                message: `Có lỗi sảy ra, nhãn hiệu đã có tồn tại, xin vui lòng thử lại!`,
                type: 'error'
            });
        } finally {
            console.log("Complete!")
            resetForm()
        }
    }

    useEffect(() => {
        if (dataForEdit != null)
            setValues({
                ...dataForEdit
            });
    }, [dataForEdit]);

    return (
        <FormCustom onSubmit={handleBrandSubmit} style={styles.pageContent}>
            <Grid container>
                <Grid item xs={6}>
                    <CustomInput
                        label="Tên thương hiệu"
                        name="name"
                        value={values.name}
                        onChange={handleInputChange}
                        style={styles.inputtext50}
                        error={errors.name}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <CustomButton
                            variant="contained"
                            color="primary"
                            size="large"
                            text="Tạo mới"
                            onClick={handleBrandSubmit}
                            sx={styles.customButton}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Notification 
                    notify={notify}
                    setNotify={setNotify}
            />
        </FormCustom>
    );
}
