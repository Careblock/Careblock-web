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
    Chip,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    HowToVote as VoteIcon,
    Assignment as ProposalIcon,
    Launch as LaunchIcon,
} from '@mui/icons-material';

interface SuccessDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
    actionType: 'vote_success' | 'proposal_created' | 'general';
    details?: {
        id?: string;
        transactionId?: string;
    };
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
    open,
    onClose,
    title,
    message,
    actionType,
    details
}) => {
    const getActionDetails = () => {
        switch (actionType) {
            case 'vote_success':
                return {
                    icon: <VoteIcon sx={{ fontSize: 60, color: 'success.main' }} />,
                    color: 'success.main',
                    bgColor: 'success.light',
                    actionText: 'Vote Submitted',
                    celebration: '🗳️ ✅'
                };
            case 'proposal_created':
                return {
                    icon: <ProposalIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
                    color: 'primary.main',
                    bgColor: 'primary.light',
                    actionText: 'Proposal Created',
                    celebration: '📝 🎉'
                };
            default:
                return {
                    icon: <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main' }} />,
                    color: 'success.main',
                    bgColor: 'success.light',
                    actionText: 'Success',
                    celebration: '✅'
                };
        }
    };

    const details_info = getActionDetails();

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { 
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar sx={{ 
                            bgcolor: 'white',
                            width: 100, 
                            height: 100,
                            border: `4px solid ${details_info.color}`,
                            boxShadow: `0 4px 20px ${details_info.color}30`,
                            animation: 'pulse 2s infinite'
                        }}>
                            {details_info.icon}
                        </Avatar>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                position: 'absolute',
                                top: -10,
                                right: -10,
                                animation: 'bounce 1s infinite'
                            }}
                        >
                            {details_info.celebration}
                        </Typography>
                    </Box>
                    <Typography variant="h4" component="div" sx={{ 
                        fontWeight: 700,
                        color: details_info.color,
                        textAlign: 'center'
                    }}>
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Box sx={{ 
                    bgcolor: 'white', 
                    p: 3, 
                    borderRadius: 3,
                    border: `2px solid ${details_info.color}20`,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    mb: 2
                }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                        color: 'text.primary',
                        fontWeight: 600,
                        textAlign: 'center'
                    }}>
                        {message}
                    </Typography>
                </Box>

                {details?.id && (
                    <Box sx={{ 
                        bgcolor: 'grey.50', 
                        p: 2, 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        mb: 2
                    }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2" color="text.secondary">
                                Reference ID:
                            </Typography>
                            <Chip 
                                label={details.id} 
                                size="small" 
                                color="primary"
                                sx={{ fontFamily: 'monospace' }}
                            />
                        </Box>
                    </Box>
                )}

                {details?.transactionId && (
                    <Box sx={{ 
                        bgcolor: 'grey.50', 
                        p: 2, 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        mb: 2
                    }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Blockchain Transaction:
                            </Typography>
                        </Box>
                        <Chip 
                            label={`${details.transactionId.substring(0, 16)}...`}
                            size="small" 
                            color="secondary"
                            sx={{ fontFamily: 'monospace' }}
                            icon={<LaunchIcon />}
                        />
                    </Box>
                )}

                <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    textAlign: 'center',
                    bgcolor: `${details_info.color}10`,
                    borderRadius: 2
                }}>
                    <Typography variant="body2" color="text.secondary">
                        {actionType === 'vote_success' ? 
                            'Your vote has been recorded on the blockchain and cannot be changed.' :
                            'Your proposal has been submitted and is now available for community voting.'
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
                        minWidth: 200,
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
                    Continue
                </Button>
            </DialogActions>

            <style>
                {`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
                `}
            </style>
        </Dialog>
    );
};

export default SuccessDialog;