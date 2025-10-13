import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    IconButton,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    Paper
} from '@mui/material';
import {
    Close as CloseIcon,
    Send as SendIcon
} from '@mui/icons-material';
import { BrowserWallet, Transaction } from '@meshsdk/core';
import VotingApiService, { CreateProposalRequest } from '../../services/votingApi.service';
import { getStakeIdFromCookies, isUserLoggedIn } from '../../utils/cookie.utils';

interface CreateProposalDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (proposalId: string, transactionId?: string) => void;
    onError?: (error: string) => void;
}

const CreateProposalDialog: React.FC<CreateProposalDialogProps> = ({
    open,
    onClose,
    onSuccess,
    onError
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        problemSummary: '',
        problemDetail: '',
        solution: ''
    });

    const steps = ['Basic Info', 'Problem Details', 'Solution', 'Review & Submit'];

    // Check login status when dialog opens
    useEffect(() => {
        if (open) {
            const loginStatus = isUserLoggedIn();
            setIsLoggedIn(loginStatus);
            if (!loginStatus) {
                setError('Please login first to create a proposal. Your stake ID is required for authentication.');
            } else {
                setError(null);
            }
        }
    }, [open]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleInputChange = (field: keyof typeof formData) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 0:
                return formData.title.trim().length > 0 && formData.problemSummary.trim().length > 0;
            case 1:
                return formData.problemDetail.trim().length > 10;
            case 2:
                return formData.solution.trim().length > 10;
            case 3:
                return true;
            default:
                return false;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            // Get stake ID from cookies
            const stakeId = getStakeIdFromCookies();
            if (!stakeId) {
                throw new Error('No stake ID found in cookies. Please login first.');
            }

            // Connect to Eternl wallet for transaction creation
            const wallet = await BrowserWallet.enable('eternl');

            // Create a simple transaction as proof of proposal creation
            const tx = new Transaction({ initiator: wallet });
            
            // Add metadata to identify this as a proposal creation transaction
            tx.setMetadata(0, {
                title: formData.title.trim(),
                type: 'CareBlock, create proposal',
                problemSummary: formData.problemSummary.trim(),
                problemDetail: formData.problemDetail.trim(),
                solution: formData.solution.trim(),
            });

            // Build and sign the transaction
            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx);
            const txHash = await wallet.submitTx(signedTx);

            // Create proposal request with real transaction data
            const proposalRequest: CreateProposalRequest = {
                title: formData.title.trim(),
                problemSummary: formData.problemSummary.trim(),
                problemDetail: formData.problemDetail.trim(),
                solution: formData.solution.trim(),
                transactionId: txHash,
                ownerStakeId: stakeId
            };

            VotingApiService.createProposal(proposalRequest).subscribe({
                next: (response) => {
                    setLoading(false);
                    
                    // Reset form
                    setFormData({
                        title: '',
                        problemSummary: '',
                        problemDetail: '',
                        solution: ''
                    });
                    setActiveStep(0);
                    
                    // Call success callback
                    if (onSuccess) {
                        onSuccess(response.proposalId, txHash);
                    }
                    
                    onClose();
                },
                error: () => {
                    const errorMessage = 'Failed to create proposal. Please try again.';
                    setError(errorMessage);
                    setLoading(false);
                    if (onError) {
                        onError(errorMessage);
                    }
                }
            });
        } catch (err: any) {
            let errorMessage = '';
            // Handle specific errors
            if (err.message?.includes('User declined')) {
                errorMessage = 'Transaction was declined. Please approve the transaction to create your proposal.';
            } else if (err.message?.includes('No stake ID found in cookies')) {
                errorMessage = 'Please login first to create a proposal. Your stake ID is required.';
            } else if (err.message?.includes('not available')) {
                errorMessage = 'Eternl wallet not found. Please install and setup Eternl wallet.';
            } else {
                errorMessage = `Failed to create proposal: ${err.message || 'Unknown error occurred'}`;
            }
            
            setError(errorMessage);
            setLoading(false);
            
            if (onError) {
                onError(errorMessage);
            }
        }
    };

    const handleClose = () => {
        if (!loading) {
            setActiveStep(0);
            setError(null);
            setFormData({
                title: '',
                problemSummary: '',
                problemDetail: '',
                solution: ''
            });
            onClose();
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom color="primary.main">
                            Basic Information
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Provide the title and summary of your proposal
                        </Typography>

                        {!isLoggedIn && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    <strong>Login Required:</strong> You must be logged in with your wallet 
                                    to create proposals. Please login first to continue.
                                </Typography>
                            </Alert>
                        )}

                        {isLoggedIn && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    <strong>Authenticated:</strong> You are logged in and can create proposals.
                                </Typography>  
                            </Alert>
                        )}
                        
                        <TextField
                            fullWidth
                            label="Proposal Title"
                            value={formData.title}
                            onChange={handleInputChange('title')}
                            margin="normal"
                            required
                            placeholder="Enter a clear, concise title for your proposal"
                            error={formData.title.trim().length === 0 && activeStep > 0}
                            helperText="A good title helps community members understand your proposal quickly"
                        />
                        
                        <TextField
                            fullWidth
                            label="Problem Summary"
                            value={formData.problemSummary}
                            onChange={handleInputChange('problemSummary')}
                            margin="normal"
                            required
                            multiline
                            rows={3}
                            placeholder="Briefly describe the problem or opportunity"
                            error={formData.problemSummary.trim().length === 0 && activeStep > 0}
                            helperText="Summarize the key issue that needs community attention"
                        />
                    </Box>
                );
            
            case 1:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom color="primary.main">
                            Problem Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Provide comprehensive details about the problem
                        </Typography>
                        
                        <TextField
                            fullWidth
                            label="Detailed Problem Description"
                            value={formData.problemDetail}
                            onChange={handleInputChange('problemDetail')}
                            margin="normal"
                            required
                            multiline
                            rows={6}
                            placeholder="Explain the problem in detail, including context, impact, and why it needs to be addressed..."
                            error={formData.problemDetail.trim().length <= 10 && activeStep > 1}
                            helperText="Minimum 10 characters. Provide enough context for informed voting."
                        />
                    </Box>
                );
            
            case 2:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom color="primary.main">
                            Proposed Solution
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Describe your proposed solution in detail
                        </Typography>
                        
                        <TextField
                            fullWidth
                            label="Solution Description"
                            value={formData.solution}
                            onChange={handleInputChange('solution')}
                            margin="normal"
                            required
                            multiline
                            rows={6}
                            placeholder="Describe your proposed solution, implementation steps, expected outcomes..."
                            error={formData.solution.trim().length <= 10 && activeStep > 2}
                            helperText="Minimum 10 characters. Be specific about how to solve the problem."
                        />
                    </Box>
                );
            
            case 3:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom color="primary.main">
                            Review Your Proposal
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Please review all information before submitting
                        </Typography>
                        
                        <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                                {formData.title}
                            </Typography>
                            
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    <strong>Blockchain Transaction:</strong> Creating this proposal will generate a blockchain transaction 
                                    that proves ownership and authenticity. Your Eternl wallet will be used to sign the transaction.
                                </Typography>
                            </Alert>
                            
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                                Problem Summary:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {formData.problemSummary}
                            </Typography>
                            
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                Problem Details:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph sx={{ 
                                maxHeight: 100, 
                                overflow: 'auto',
                                border: '1px solid',
                                borderColor: 'grey.300',
                                p: 1,
                                borderRadius: 1
                            }}>
                                {formData.problemDetail}
                            </Typography>
                            
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                Proposed Solution:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ 
                                maxHeight: 100, 
                                overflow: 'auto',
                                border: '1px solid',
                                borderColor: 'grey.300',
                                p: 1,
                                borderRadius: 1
                            }}>
                                {formData.solution}
                            </Typography>
                        </Paper>
                        
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </Box>
                );
            
            default:
                return null;
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2, maxHeight: '90vh' }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pb: 1 
            }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                    Create New Proposal
                </Typography>
                <IconButton onClick={handleClose} size="small" disabled={loading}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 3 }}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {renderStepContent(activeStep)}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button 
                    onClick={handleBack} 
                    disabled={activeStep === 0 || loading}
                    variant="outlined"
                >
                    Back
                </Button>
                
                <Box sx={{ flex: '1 1 auto' }} />
                
                {activeStep === steps.length - 1 ? (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        size="large"
                        disabled={!validateStep(activeStep) || loading || !isLoggedIn}
                        startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                    >
                        {loading ? 'Creating...' : 'Submit Proposal'}
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        variant="contained"
                        disabled={!validateStep(activeStep)}
                    >
                        Next
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CreateProposalDialog;