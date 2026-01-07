import React from 'react';
import { Alert, Snackbar } from '@mui/material';

export default function Toaster({ message, severity, open, handleClose }) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
                marginTop: { xs: '60px', md: '30px' },
                marginRight: { xs: '0px', md: '70px' },
                width: { xs: '95%', md: 'auto' },
                maxWidth: { xs: '95%', md: '400px' },
                left: { xs: '50%', md: 'auto' },
                transform: { xs: 'translateX(-50%)', md: 'none' },
                right: { xs: 'auto', md: 'auto' } // Let anchorOrigin handle desktop right
            }}
        >
            <Alert
                severity={severity}
                variant="outlined"
                sx={{
                    width: '100%',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                    backgroundColor: 'white'
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
