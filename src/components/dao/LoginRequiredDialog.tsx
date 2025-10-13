import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
    Avatar,
} from '@mui/material';
import {
    Login as LoginIcon,
    Warning as WarningIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';

interface LoginRequiredDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
    actionType: 'create_proposal' | 'vote' | 'general';
    showLoginButton?: boolean; // New prop to control if login button should be shown
}

const LoginRequiredDialog: React.FC<LoginRequiredDialogProps> = ({
    open,
    onClose,
    title,
    message,
    actionType,
    showLoginButton = true // Default to true for backward compatibility
}) => {
    const getActionDetails = () => {
        switch (actionType) {
            case 'create_proposal':
                return {
                    icon: <SecurityIcon sx={{ fontSize: 60, color: 'warning.main' }} />,
                    color: 'warning.main',
                    actionText: 'Create Proposal',
                    description: 'Creating proposals requires wallet authentication to ensure ownership and prevent spam.'
                };
            case 'vote':
                return {
                    icon: <LoginIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
                    color: 'primary.main',
                    actionText: 'Cast Vote',
                    description: 'Voting requires authentication to maintain the integrity of the democratic process.'
                };
            default:
                return {
                    icon: <WarningIcon sx={{ fontSize: 60, color: 'error.main' }} />,
                    color: 'error.main',
                    actionText: 'Action',
                    description: 'This action requires authentication.'
                };
        }
    };

    const details = getActionDetails();

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { 
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Avatar sx={{ 
                        bgcolor: 'background.paper',
                        width: 80, 
                        height: 80,
                        border: `3px solid ${details.color}`,
                        boxShadow: 2
                    }}>
                        {details.icon}
                    </Avatar>
                    <Typography variant="h5" component="div" sx={{ 
                        fontWeight: 600,
                        color: details.color
                    }}>
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Alert 
                    severity={actionType === 'vote' ? 'info' : 'warning'} 
                    sx={{ mb: 3, borderRadius: 2 }}
                >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {message}
                    </Typography>
                </Alert>

                <Box sx={{ 
                    bgcolor: 'grey.50', 
                    p: 2, 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.200'
                }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ 
                        color: 'text.primary',
                        fontWeight: 600
                    }}>
                        Why is authentication required?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {details.description}
                    </Typography>
                </Box>

                {showLoginButton && (
                    <Box sx={{ mt: 2, p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Please connect your wallet to authenticate and access DAO features.
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
                {showLoginButton ? (
                    <Button
                        onClick={onClose}
                        variant="contained"
                        size="large"
                        startIcon={<LoginIcon />}
                        sx={{
                            minWidth: 200,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            py: 1.5,
                            background: `linear-gradient(45deg, ${details.color} 30%, ${details.color}99 90%)`,
                            boxShadow: `0 3px 10px ${details.color}40`,
                            '&:hover': {
                                boxShadow: `0 4px 15px ${details.color}60`,
                            }
                        }}
                    >
                        Go to Login
                    </Button>
                ) : (
                    <Button
                        onClick={onClose}
                        variant="contained"
                        size="large"
                        sx={{
                            minWidth: 120,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            py: 1.5,
                            background: `linear-gradient(45deg, ${details.color} 30%, ${details.color}99 90%)`,
                            boxShadow: `0 3px 10px ${details.color}40`,
                            '&:hover': {
                                boxShadow: `0 4px 15px ${details.color}60`,
                            }
                        }}
                    >
                        OK
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default LoginRequiredDialog;