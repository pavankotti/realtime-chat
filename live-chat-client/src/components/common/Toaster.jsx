import React from 'react';
import { Alert, Snackbar } from '@mui/material';

export default function Toaster({ message, severity, open, handleClose }) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ marginTop: '30px', marginRight: '70px'}}
        >
            <Alert
                severity={severity}
                variant="outlined"
                sx={{ width: '20vw', borderRadius: '10px'}}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
