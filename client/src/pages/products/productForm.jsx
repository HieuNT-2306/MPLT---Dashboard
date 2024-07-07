import React, { useState, useEffect } from "react";
import SelectButton from 'components/controls/SelectButton';
import { useGetBrandsQuery, useGetCategoriesQuery, useScrapHasakiMutation, useScrapLazadaMutation, useScrapSendoMutation, useScrapTikiMutation } from 'state/api'
import { useTheme } from "@emotion/react";
import { Box, Grid, Link, Paper, TextField, Typography } from "@mui/material";
import { Useform, FormCustom } from "components/Useform";
import CustomButton from "components/controls/CustomButton";
import CustomInput from "components/controls/CustomInput";
import { Add, AddAPhoto, Edit } from "@mui/icons-material";


const initialValues = {
  _id: null,
  name: "",
  searchName: "",
  brand: "",
  category: "",
  price: "",
  description: "",
  supply: "",
  imgFile: null,
  img: "",
  dataFromScrapingLazada: [],
  dataFromScrapingTiki: [],
  dataFromScrapingHasaki: [],
  dataFromScrapingSendo: [],
  productStat: {}
}

export default function ProductForm(props) {
  const { data: categories, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const { data: brands, isLoading: isLoadingBrands } = useGetBrandsQuery();
  const [scrapLazada] = useScrapLazadaMutation();
  const [scrapTiki] = useScrapTikiMutation();
  const [scrapHasaki] = useScrapHasakiMutation();
  const [scrapSendo] = useScrapSendoMutation();

  const [scrapLazadaLoading, setScrapLazadaLoading] = useState(false);
  const [scrapTikiLoading, setScrapTikiLoading] = useState(false);
  const [scrapHasakiLoading, setScrapHasakiLoading] = useState(false);
  const [scrapSendoLoading, setScrapSendoLoading] = useState(false);
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
    if (values._id) formData.append("_id", values._id);
    formData.append("name", values.name);
    formData.append("searchName", values.searchName);
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
  const getDataFromLazada = async (id) => {
    console.log("id", id);
    setScrapLazadaLoading(true);
    const response = await scrapLazada(id);
    console.log("response", response);
    setValues({
      ...values,
      dataFromScrapingLazada: !response.error ? response.data.dataFromScrapingLazada : []
    })
    setScrapLazadaLoading(false);
  }

  const getDataFromTiki = async (id) => {
    console.log("id", id);
    setScrapTikiLoading(true);
    const response = await scrapTiki(id);
    setValues({
      ...values,
      dataFromScrapingTiki: response.data.dataFromScrapingTiki
    })
    setScrapTikiLoading(false);
  }

  const getDataFromHasaki = async (id) => {
    console.log("id", id);
    setScrapHasakiLoading(true);
    const response = await scrapHasaki(id);
    setValues({
      ...values,
      dataFromScrapingHasaki: response.data.dataFromScrapingHasaki
    })
    setScrapHasakiLoading(false);
  }

  const getDataFromSendo = async (id) => {
    console.log("id", id);
    setScrapSendoLoading(true);
    const response = await scrapSendo(id);
    setValues({
      ...values,
      dataFromScrapingSendo: response.data.dataFromScrapingSendo
    })
    setScrapSendoLoading(false);
  }
  
  useEffect(() => {
    if (dataForEdit != null) {
      setValues({
        ...dataForEdit
      });
    }
  }, [dataForEdit]);

  const imgStyle = { width: "65%", aspectRatio: "1 / 1", objectFit: "cover", border: "1px solid blue", margin: "0px 80px" };
  return (
    <FormCustom onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          {values.imgFile ?
            <img src={URL.createObjectURL(values.imgFile)} style={imgStyle} alt="product" />
            : values.img ? <img src={values.img} style={imgStyle} alt="product" /> : null}
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
            <Add /> <Typography>Thêm 1 ảnh mới/ thay đổi 1 ảnh</Typography>
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
          <CustomInput
            name="searchName"
            label="Tên tìm kiếm sản phẩm"
            sx={styles.inputtext50}
            value={values.searchName}
            onChange={handleInputChange}
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
            rows={3}
            sx={styles.inputtex100}
            value={values.description}
            onChange={handleInputChange}
            error={errors.description}
          />
        </Grid>
        <Grid item xs={12} >
          <Typography variant="h5" margin="8px">Lazada:</Typography>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-end',
          }}>
            <CustomButton
              variant="contained"
              color="secondary"
              size="large"
              text="Quét dữ liệu từ Lazada"
              onClick={() => { getDataFromLazada(values._id) }}
              disabled={values._id ? false : true}
              sx={styles.customButton}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: "100%",
              overflowX: 'auto'
            }}
          >
            {
              scrapLazadaLoading ? (
                <Typography variant="h6" margin="8px">Xin hãy chờ trong giây lát.....</Typography>
              ) : (values.dataFromScrapingLazada ? 
                values.dataFromScrapingLazada.products?.length > 0 ? 
                  (values.dataFromScrapingLazada.products.map((item, index) => {
                return (
                  <Paper key={index} sx={{ margin: "5px", padding: "5px", minWidth: "250px", border: "2px solid", borderColor: theme.palette.neutral[200] }}>
                    {/* <a href={item.link} target="_blank">
                      <img src={item.img} style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", border: "1px solid blue" }}/>
                    </a> */}
                    <a
                      style={{
                        color: theme.palette.neutral[100],
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                        maxWidth: "100%",
                      }}
                      href={item.link}
                      target="_blank"
                    >{item.name}</a>
                    <Typography variant="body1" color={theme.palette.secondary[400]} >{item.price}</Typography>
                    <Typography variant="body1" color={theme.palette.secondary[400]}>Số lượng bán ra: {item.soldNumber == -1 ? "Không có" : item.soldNumber}</Typography>
                  </Paper>
                )
              })): (
                <Paper sx={{ margin: "5px", padding: "5px", minWidth: "95%", border: "2px solid", borderColor: theme.palette.neutral[200] }}>
                  <Typography variant="h6" color={theme.palette.secondary[400]} >Không tìm kiếm thấy sản phẩm nào phù hợp!</Typography>
                </Paper>
              )
               : null)
              //console.log(values.dataFromScrapingLazada.products)
            }
          </Box>
          {
            values.dataFromScrapingLazada
              ? <Typography variant="h6" margin="8px" >Thời gian lấy dữ liệu lần cuối: {new Date(values.dataFromScrapingLazada.lastScraped).toLocaleString('vi-VN')}</Typography>
              : null
          }
        </Grid>
        <Grid item xs={12} >
          <Typography variant="h5" margin="8px" >Tiki:</Typography>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-end',
          }}>
            <CustomButton
              variant="contained"
              color="secondary"
              size="large"
              text="Quét dữ liệu từ Tiki"
              onClick={() => { getDataFromTiki(values._id) }}
              disabled={values._id ? false : true}
              sx={styles.customButton}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: "100%",
              overflowX: 'auto'
            }}
          >
            {
              scrapTikiLoading ? (
                <Typography variant="h6" margin="8px">Xin hãy chờ trong giây lát.....</Typography>
              ) : (values.dataFromScrapingTiki ?
                values.dataFromScrapingTiki.products?.length > 0 ?
                  (values.dataFromScrapingTiki.products.map((item, index) => {
                    return (
                      <Paper key={index} sx={{ margin: "5px", padding: "5px", minWidth: "250px", border: "2px solid", borderColor: theme.palette.neutral[200] }}>
                        <a
                          style={{
                            color: theme.palette.neutral[100],
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                            maxWidth: "100%",
                          }}
                          href={item.link}
                          target="_blank"
                        >{item.name}</a>
                        <Typography variant="body1" color={theme.palette.secondary[400]} >{item.price}</Typography>
                        <Typography variant="body1" color={theme.palette.secondary[400]}>Số lượng bán ra: {item.soldNumber == -1 ? "Không có" : item.soldNumber}</Typography>
                      </Paper>
                    )
                  })) :
                  (
                    <Paper sx={{ margin: "5px", padding: "5px", minWidth: "95%", border: "2px solid", borderColor: theme.palette.neutral[200] }}>
                      <Typography variant="h6" color={theme.palette.secondary[400]} >Không tìm kiếm thấy sản phẩm nào phù hợp!</Typography>
                    </Paper>
                  )
                : null)
              //console.log(values.dataFromScrapingLazada.products)
            }
          </Box>
          {
            values.dataFromScrapingTiki ? <Typography variant="h6" margin="8px">Thời gian lấy dữ liệu lần cuối: {new Date(values.dataFromScrapingTiki.lastScraped).toLocaleString('vi-VN')}</Typography> : null
          }
        </Grid>
        <Grid item xs={12} >
          <Typography variant="h5" margin="8px">Hasaki:</Typography>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-end',
          }}>
            <CustomButton
              variant="contained"
              color="secondary"
              size="large"
              text="Quét dữ liệu từ Hasaki"
              onClick={() => { getDataFromHasaki(values._id) }}
              disabled={values._id ? false : true}
              sx={styles.customButton}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: "100%",
              overflowX: 'auto'
            }}
          >
            {
              scrapHasakiLoading ? (
                <Typography variant="h6" margin="8px">Xin hãy chờ trong giây lát.....</Typography>
              ) : (values.dataFromScrapingHasaki ?
                values.dataFromScrapingHasaki.products?.length > 0 ?
                  (values.dataFromScrapingHasaki.products.map((item, index) => {
                    return (
                      <Paper key={index} sx={{ margin: "5px", padding: "5px", minWidth: "250px", border: "2px solid", borderColor: theme.palette.neutral[200] }}>
                        <a
                          style={{
                            color: theme.palette.neutral[100],
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                            maxWidth: "100%",
                          }}
                          href={item.link}
                          target="_blank"
                        >{item.name}</a>
                        <Typography variant="body1" color={theme.palette.secondary[400]} >{item.price}</Typography>
                        <Typography variant="body1" color={theme.palette.secondary[400]}>Số lượng bán ra: {item.soldNumber == -1 ? "Không có" : item.soldNumber}</Typography>
                      </Paper>
                    )
                  })) :
                  (
                    <Paper sx={{ margin: "5px", padding: "5px", minWidth: "95%", border: "2px solid", borderColor: theme.palette.neutral[200] }}>
                      <Typography variant="h6" color={theme.palette.secondary[400]} >Không tìm kiếm thấy sản phẩm nào phù hợp!</Typography>
                    </Paper>
                  )
                : null)
              //console.log(values.dataFromScrapingLazada.products)
            }
          </Box>
          {
            values.dataFromScrapingHasaki ? <Typography variant="h6" margin="8px">Thời gian lấy dữ liệu lần cuối: {new Date(values.dataFromScrapingHasaki.lastScraped).toLocaleString('vi-VN')}</Typography> : null
          }
        </Grid>

        <Grid item xs={12} >
          <Typography variant="h5" margin="8px">Sendo:</Typography>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-end',
          }}>
            <CustomButton
              variant="contained"
              color="secondary"
              size="large"
              text="Quét dữ liệu từ Sendo"
              onClick={() => { getDataFromSendo(values._id) }}
              disabled={values._id ? false : true}
              sx={styles.customButton}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: "100%",
              overflowX: 'auto'
            }}
          >
            {
              scrapSendoLoading ? (
                <Typography variant="h6" margin="8px">Xin hãy chờ trong giây lát.....</Typography>
              ) : (values.dataFromScrapingSendo ?
                values.dataFromScrapingSendo.products?.length > 0 ?
                  (values.dataFromScrapingSendo.products.map((item, index) => {
                    return (
                      <Paper key={index} sx={{ margin: "5px", padding: "5px", minWidth: "250px", border: "2px solid", borderColor: theme.palette.neutral[200] }}>
                        <a
                          style={{
                            color: theme.palette.neutral[100],
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                            maxWidth: "100%",
                          }}
                          href={item.link}
                          target="_blank"
                        >{item.name}</a>
                        <Typography variant="body1" color={theme.palette.secondary[400]} >{item.price}</Typography>
                        <Typography variant="body1" color={theme.palette.secondary[400]}>Số lượng bán ra: {item.soldNumber == -1 ? "Không có" : item.soldNumber}</Typography>
                      </Paper>
                    )
                  }) ) :
                  (
                    <Paper sx={{ margin: "5px", padding: "5px", minWidth: "95%", border: "2px solid", borderColor: theme.palette.neutral[200] }}>
                      <Typography variant="h6" color={theme.palette.secondary[400]} >Không tìm kiếm thấy sản phẩm nào phù hợp!</Typography>
                    </Paper>
                  )
                : null)
            }
          </Box>
          {
            values.dataFromScrapingSendo ? <Typography variant="h6" margin="8px">Thời gian lấy dữ liệu lần cuối: {new Date(values.dataFromScrapingSendo.lastScraped).toLocaleString('vi-VN')}</Typography> : null
          }
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
        </Box>
      </Grid>
    </FormCustom>
  )
}
