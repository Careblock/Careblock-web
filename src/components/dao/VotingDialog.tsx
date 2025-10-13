import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Typography,
    Box,
    Alert,
    CircularProgress,
} from '@mui/material';
import { BrowserWallet, Transaction } from '@meshsdk/core';
import { VoteChoice } from '@/enums/DAOVoting';
import { getStakeIdFromCookies, isUserLoggedIn } from '@/utils/cookie.utils';
import VotingApiService, { VoteSubmissionRequest } from '@/services/votingApi.service';

interface VotingDialogProps {
    open: boolean;
    onClose: () => void;
    onVoteSuccess?: (transactionId?: string) => void;
    onVoteError?: (error: string) => void;
    proposalId: string;
    proposalTitle: string;
    loading?: boolean;
}

const VotingDialog: React.FC<VotingDialogProps> = ({
    open,
    onClose,
    onVoteSuccess,
    onVoteError,
    proposalId,
    proposalTitle,
    loading = false,
}) => {
    const [choice, setChoice] = useState<VoteChoice | ''>('');
    const [rationale, setRationale] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status when dialog opens
    useEffect(() => {
        if (open) {
            const loginStatus = isUserLoggedIn();
            setIsLoggedIn(loginStatus);
            if (!loginStatus) {
                setError('Please login first to cast your vote. Your stake ID is required for authentication.');
            } else {
                setError('');
            }
        } else {
            // Reset states when dialog closes
            setChoice('');
            setRationale('');
            setError('');
            setIsSubmitting(false);
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!choice) {
            setError('Please select a voting choice');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Get stake ID from cookies
            const stakeId = getStakeIdFromCookies();
            if (!stakeId) {
                throw new Error('No stake ID found in cookies. Please login first.');
            }

            // Connect to Eternl wallet for transaction creation
            const wallet = await BrowserWallet.enable('eternl');

            // Create a transaction as proof of vote
            const tx = new Transaction({ initiator: wallet });
            
            // Add metadata to identify this as a vote transaction
            tx.setMetadata(0, {
                proposalId,
                voteChoice: choice,
                proposalTitle,
                type: 'vote_cast',
                timestamp: Date.now()
            });

            // Build and sign the transaction
            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx);
            const txHash = await wallet.submitTx(signedTx);

            // Create vote submission request with transaction data
            const voteSubmission: VoteSubmissionRequest = {
                choice: choice === 'YES' ? 1 : choice === 'NO' ? 2 : 3,
                metadata: rationale.trim() || `Vote cast for proposal: ${proposalTitle}`,
                transactionId: txHash,
                ownerStakeId: stakeId
            };

            // Submit vote to API
            VotingApiService.submitVote(proposalId, voteSubmission).subscribe({
                next: (response) => {
                    console.log('Vote submitted successfully:', response);
                    setIsSubmitting(false);
                    
                    if (response.success) {
                        // Reset form 
                        setChoice('');
                        setRationale('');
                        setError('');
                        
                        // Call success callback to refresh data
                        if (onVoteSuccess) {
                            onVoteSuccess(txHash); // Use txHash instead of transactionId
                        }
                        
                        // Don't call onClose() here - let the parent handle closing via onVoteSuccess
                    } else {
                        const errorMessage = 'Vote submission failed. Please try again.';
                        setError(errorMessage);
                        if (onVoteError) {
                            onVoteError(errorMessage);
                        }
                    }
                },
                error: (error) => {
                    console.error('Vote submission API error:', error);
                    const errorMessage = 'Error submitting vote to server. Please try again.';
                    setError(errorMessage);
                    setIsSubmitting(false);
                    if (onVoteError) {
                        onVoteError(errorMessage);
                    }
                }
            });
        } catch (err: any) {
            console.error('Error during voting process:', err);
            
            let errorMessage = '';
            // Handle specific errors
            if (err.message?.includes('User declined')) {
                errorMessage = 'Transaction was declined. Please approve the transaction to cast your vote.';
            } else if (err.message?.includes('No stake ID found in cookies')) {
                errorMessage = 'Please login first to cast your vote. Your stake ID is required.';
            } else if (err.message?.includes('not available')) {
                errorMessage = 'Eternl wallet not found. Please install and setup Eternl wallet.';
            } else {
                errorMessage = `Failed to cast vote: ${err.message || 'Unknown error occurred'}`;
            }
            
            setError(errorMessage);
            setIsSubmitting(false);
            
            if (onVoteError) {
                onVoteError(errorMessage);
            }
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setChoice('');
            setRationale('');
            setError('');
            setIsSubmitting(false);
            onClose();
        }
    };

    const getChoiceDescription = (choice: VoteChoice) => {
        switch (choice) {
            case VoteChoice.YES:
                return 'Vote in favor of this proposal';
            case VoteChoice.NO:
                return 'Vote against this proposal';
            case VoteChoice.ABSTAIN:
                return 'Abstain from voting (neutral position)';
            default:
                return '';
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Cast Your Vote
            </DialogTitle>
            
            <DialogContent>
                <Typography variant="subtitle1" gutterBottom>
                    Proposal: {proposalTitle}
                </Typography>

                {!isLoggedIn && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            <strong>Login Required:</strong> You must be logged in with your wallet 
                            to cast votes. Please login first to continue.
                        </Typography>
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                        Your Vote:
                    </Typography>
                    <RadioGroup
                        value={choice}
                        onChange={(e) => {
                            if (isLoggedIn) {
                                setChoice(e.target.value as VoteChoice);
                                setError('');
                            }
                        }}
                    >
                        {Object.values(VoteChoice).map((voteChoice) => (
                            <Box key={voteChoice} mb={1}>
                                <FormControlLabel
                                    value={voteChoice}
                                    control={<Radio />}
                                    disabled={!isLoggedIn}
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="medium">
                                                {voteChoice}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {getChoiceDescription(voteChoice)}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </Box>
                        ))}
                    </RadioGroup>
                </Box>

                <Box mt={3}>
                    <Typography variant="subtitle2" gutterBottom>
                        Rationale (Optional):
                    </Typography>
                    <TextField
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Explain your voting decision..."
                        value={rationale}
                        onChange={(e) => setRationale(e.target.value)}
                        variant="outlined"
                    />
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                        <strong>Blockchain Transaction:</strong> Your vote will be recorded on the blockchain 
                        and cannot be changed once submitted. Your Eternl wallet will be used to sign the transaction.
                    </Typography>
                </Alert>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} disabled={loading || isSubmitting}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || isSubmitting || !choice || !isLoggedIn}
                    color="primary"
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
                >
                    {isSubmitting ? 'Creating Transaction...' : 'Submit Vote'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VotingDialog;