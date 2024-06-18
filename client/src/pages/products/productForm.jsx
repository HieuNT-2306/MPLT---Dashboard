import React, { useState, useEffect } from "react";
import SelectButton from 'components/controls/SelectButton';
import { useGetBrandsQuery, useGetCategoriesQuery } from 'state/api'
import { useTheme } from "@emotion/react";
import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { Useform, FormCustom } from "components/Useform";
import CustomButton from "components/controls/CustomButton";
import CustomInput from "components/controls/CustomInput";
import { Add, AddAPhoto, Edit } from "@mui/icons-material";


const initialValues = {
  _id: "",
  name: "",
  brand: "",
  category: "",
  price: "",
  description: "",
  supply: "",
  imgFile: null,
  img: "",
  productStat: {}
}

export default function ProductForm(props) {
  const { data: categories, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const { data: brands, isLoading: isLoadingBrands } = useGetBrandsQuery();
  
  const { addOrEdit, dataForEdit } = props;

  const theme = useTheme();
  const styles = {
    inputtext50: {
      width: "85%",
      margin: "8px",
    },
    inputtex100: {
      width: "92.5%",
      margin: "8px",
      height: "100%"
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
    if ("price" in fieldValues)
      temp.price = fieldValues.price ? "" : "Trường này không được để trống";
    if ("description" in fieldValues)
      temp.description = fieldValues.description ? "" : "Trường này không được để trống";
    if ("category" in fieldValues)
      temp.category = fieldValues.category ? "" : "Trường này không được để trống";
    if ("brand" in fieldValues)
      temp.brand = fieldValues.brand ? "" : "Trường này không được để trống";
    if ("supply" in fieldValues)
      temp.supply = fieldValues.supply ? "" : "Trường này không được để trống";
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
  } = Useform(initialValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("brand", values.brand);
    formData.append("supply", values.supply);

    if (values.imgFile) {
      formData.append("img", values.imgFile); 
    }
    console.log("values:", formData);
    addOrEdit(formData, resetForm);
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setValues({
      ...values,
      imgFile: file
    });
  };
  useEffect(() => {
    if (dataForEdit != null) {
        setValues({
            ...dataForEdit
        });
    }
}, [dataForEdit]);

  const imgStyle = { width: "80%", aspectRatio: "1 / 1", objectFit: "cover", border: "1px solid blue", margin: "0px 40px"};
  return (
    <FormCustom onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          {values.imgFile ? 
          <img src={URL.createObjectURL(values.imgFile)} style={imgStyle} alt="product" /> 
          : values.img ? <img src={values.img} style={imgStyle} alt="product" /> : null }
          <label for="file-upload"             
            style={{ 
              margin: "8px", 
              padding: "10px", 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              width: "95%",
              fontSize: "1rem",
              textAlign: "center",
              border: "2px solid ",
              borderColor: theme.palette.primary.main,
            }}>
              <Add/> <Typography>Thêm 1 ảnh mới/ thay đổi 1 ảnh</Typography> 
          </label>
          <input type="file" 
            onChange={handleFileChange} 
            id="file-upload"
            style={{ display: "none" }} 
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInput
            name="name"
            label="Tên sản phẩm"
            sx={styles.inputtext50}
            value={values.name}
            onChange={handleInputChange}
            error={errors.name}
          />
          <SelectButton
            name="category"
            label="Danh mục"
            value={values.category}
            sx={styles.inputtext50}
            onChange={handleInputChange}
            options={categories && categories.map(category => ({ id: category._id, name: category.name }))}
          />
          <SelectButton
            name="brand"
            label="Nhãn hàng"
            value={values.brand}
            sx={styles.inputtext50}
            onChange={handleInputChange}
            options={brands && brands.map(category => ({ id: category._id, name: category.name }))}
          />
          <CustomInput 
            name="supply"
            label="Số lượng trong kho"
            value={values.supply}
            sx={styles.inputtext50}
            onChange={handleInputChange}
            error={errors.name}
          />
          <CustomInput
            name="price"
            label="Giá"
            sx={styles.inputtext50}
            value={values.price}
            onChange={handleInputChange}
            error={errors.price}
          />
        </Grid>
        <Grid item xs={12} >
          <CustomInput
            name="description"
            label="Mô tả"
            rows={5}
            sx={styles.inputtex100}
            value={values.description}
            onChange={handleInputChange}
            error={errors.description}
          />
        </Grid>
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
    </FormCustom>
  )
}
