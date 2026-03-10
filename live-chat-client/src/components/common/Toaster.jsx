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
                right: { xs: 'auto', md: 'auto' }
            }}
        >
            <Alert
                severity={severity}
                variant="filled"
                sx={{
                    width: '100%',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(8px)',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
