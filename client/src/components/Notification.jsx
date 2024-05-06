import { Alert, Snackbar } from '@mui/material';
import React from 'react'

export default function Notification(props) {
    const {notify, setNotify} = props;

  return (
      <Snackbar
        open={notify.isOpen}
        autoHideDuration={3000}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        onClose={() => setNotify({...notify, isOpen: false})}
      >
        <Alert 
            severity={notify.type} 
            onClose={() => setNotify({...notify, isOpen: false})}
        >
            {notify.message}
        </Alert>
      </Snackbar>
  )
}
