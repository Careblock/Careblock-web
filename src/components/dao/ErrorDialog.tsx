import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Avatar,
    Alert,
} from '@mui/material';
import {
    Error as ErrorIcon,
    Warning as WarningIcon,
    Block as BlockIcon,
} from '@mui/icons-material';

interface ErrorDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
    errorType: 'vote_error' | 'proposal_error' | 'wallet_error' | 'general';
    details?: {
        transactionId?: string;
        proposalId?: string;
    };
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({
    open,
    onClose,
    title,
    message,
    errorType,
    details
}) => {
    const getErrorDetails = () => {
        switch (errorType) {
            case 'vote_error':
                return {
                    icon: <BlockIcon sx={{ fontSize: 60, color: 'error.main' }} />,
                    color: 'error.main',
                    bgColor: 'error.light',
                    severity: 'error' as const,
                    emoji: '❌ 🗳️'
                };
            case 'proposal_error':
                return {
                    icon: <ErrorIcon sx={{ fontSize: 60, color: 'warning.main' }} />,
                    color: 'warning.main',
                    bgColor: 'warning.light',
                    severity: 'warning' as const,
                    emoji: '⚠️ 📝'
                };
            case 'wallet_error':
                return {
                    icon: <WarningIcon sx={{ fontSize: 60, color: 'orange' }} />,
                    color: 'orange',
                    bgColor: '#fff3e0',
                    severity: 'warning' as const,
                    emoji: '👛 ❌'
                };
            default:
                return {
                    icon: <ErrorIcon sx={{ fontSize: 60, color: 'error.main' }} />,
                    color: 'error.main',
                    bgColor: 'error.light',
                    severity: 'error' as const,
                    emoji: '❌'
                };
        }
    };

    const details_info = getErrorDetails();

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
                        bgcolor: details_info.bgColor,
                        width: 80, 
                        height: 80,
                        border: `3px solid ${details_info.color}`,
                        boxShadow: 3,
                        // Pulse animation for error
                        animation: 'pulse 2s infinite'
                    }}>
                        {details_info.icon}
                    </Avatar>
                    <Typography variant="h5" component="div" sx={{ 
                        fontWeight: 600,
                        color: details_info.color,
                        textAlign: 'center'
                    }}>
                        {details_info.emoji} {title}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Alert 
                    severity={details_info.severity} 
                    sx={{ mb: 3, borderRadius: 2 }}
                >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {message}
                    </Typography>
                </Alert>

                {details?.proposalId && (
                    <Box sx={{ 
                        bgcolor: 'grey.50', 
                        p: 2, 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        mb: 2
                    }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Proposal ID:
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
                            {details.proposalId}
                        </Typography>
                    </Box>
                )}

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
                        What can you do?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {errorType === 'wallet_error' 
                            ? 'Please check your wallet connection and try again. Make sure your wallet is unlocked and connected.'
                            : errorType === 'vote_error'
                            ? 'Please check your internet connection and try voting again. If the problem persists, contact support.'
                            : 'Please try again later. If the problem persists, contact our support team.'
                        }
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
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
                        background: `linear-gradient(45deg, ${details_info.color} 30%, ${details_info.color}99 90%)`,
                        boxShadow: `0 3px 10px ${details_info.color}40`,
                        '&:hover': {
                            boxShadow: `0 4px 15px ${details_info.color}60`,
                        }
                    }}
                >
                    Try Again
                </Button>
            </DialogActions>

            <style>
                {`
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                `}
            </style>
        </Dialog>
    );
};

export default ErrorDialog;