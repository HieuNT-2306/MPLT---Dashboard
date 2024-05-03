import React, { useState } from 'react'
import { Box, useTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { useCreateCustomerMutation } from 'state/api';

const CustomerForm = (
  customerinitData
) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [customerData, setCustomerData] = useState(customerinitData);
  console.log("customerData", customerData); 
  const [createUser, { isLoading, error }] = useCreateCustomerMutation();
  const handleSubmitAdd = async () => {
    try {
        await createUser(customerData).unwrap();
        console.log("Customer created successfully: ", customerData);
        handleClose();
    } catch (error) {
        console.log("Customer creation failed: ", error);
    }
};

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    setCustomerData({ ...customerData, [event.target.name]: event.target.value });
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Thêm khách hàng
      </Button>
      {/* Form popup */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Thêm khách hàng mới</DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.paper }}> {/* Apply background color from theme */}
          <TextField
            autoFocus
            margin="dense"
            label="Tên"
            type="text"
            fullWidth
            variant="standard"
            name="name"
            value={customerData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            name="email"
            value={customerData.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Số điện thoại"
            type="tel"
            fullWidth
            variant="standard"
            name="phonenumber"
            value={customerData.phonenumber}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Địa chỉ"
            type="text"
            fullWidth
            variant="standard"
            name="address"
            value={customerData.address}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: theme.palette.background.paper }}> {/* Apply background color from theme */}
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant="contained" color="primary" onClick={handleSubmitAdd}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CustomerForm 
