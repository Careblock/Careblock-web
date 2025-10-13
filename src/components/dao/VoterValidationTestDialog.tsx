import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Chip
} from '@mui/material';
import {
    Security as SecurityIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import VotingApiService from '../../services/votingApi.service';

interface VoterValidationTestDialogProps {
    open: boolean;
    onClose: () => void;
    votingId: string;
    proposalTitle: string;
}

const VoterValidationTestDialog: React.FC<VoterValidationTestDialogProps> = ({
    open,
    onClose,
    votingId,
    proposalTitle
}) => {
    const [stakeId, setStakeId] = useState('test001');
    const [validating, setValidating] = useState(false);
    const [result, setResult] = useState<{ canVote: boolean; stakeId: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const testValidation = async () => {
        if (!stakeId.trim()) {
            setError('Please enter a stake ID');
            return;
        }

        setValidating(true);
        setError(null);
        setResult(null);

        try {
            VotingApiService.validateVoter(votingId, stakeId.trim()).subscribe({
                next: (response) => {
                    console.log('Validation result:', response);
                    setResult({
                        canVote: response.canVote,
                        stakeId: stakeId.trim()
                    });
                    setValidating(false);
                },
                error: (err) => {
                    console.error('Validation error:', err);
                    setError('Failed to validate voter. Please try again.');
                    setValidating(false);
                }
            });
        } catch (err) {
            console.error('Validation error:', err);
            setError('Failed to validate voter. Please try again.');
            setValidating(false);
        }
    };

    const handleClose = () => {
        setResult(null);
        setError(null);
        setStakeId('test001');
        onClose();
    };

    const presetStakeIds = [
        'test001',
        'authorized-user',
        'unauthorized-user',
        'blocked-user',
        'admin-stake',
        'invalid-stake'
    ];

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 2,
                pb: 1
            }}>
                <SecurityIcon color="primary" />
                <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        Test Voter Validation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {proposalTitle}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Test different stake IDs to see voting permissions for this proposal.
                </Typography>

                <TextField
                    fullWidth
                    label="Stake ID"
                    value={stakeId}
                    onChange={(e) => setStakeId(e.target.value)}
                    margin="normal"
                    placeholder="Enter stake ID to test"
                    disabled={validating}
                />

                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Quick test presets:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {presetStakeIds.map((preset) => (
                            <Chip
                                key={preset}
                                label={preset}
                                onClick={() => setStakeId(preset)}
                                variant={stakeId === preset ? 'filled' : 'outlined'}
                                size="small"
                                disabled={validating}
                            />
                        ))}
                    </Box>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={testValidation}
                    disabled={validating || !stakeId.trim()}
                    startIcon={validating ? <CircularProgress size={20} /> : <SecurityIcon />}
                    sx={{ mb: 2 }}
                >
                    {validating ? 'Validating...' : 'Test Validation'}
                </Button>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {result && (
                    <Alert 
                        severity={result.canVote ? 'success' : 'error'} 
                        sx={{ mb: 2 }}
                        icon={result.canVote ? <CheckIcon /> : <CancelIcon />}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Stake ID: "{result.stakeId}"
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {result.canVote 
                                ? '✅ Có quyền bỏ phiếu - Stake ID này được ủy quyền vote' 
                                : '❌ KHÔNG có quyền bỏ phiếu - Stake ID này bị chặn hoặc không được ủy quyền'
                            }
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                            {result.canVote 
                                ? 'User này có thể thực hiện tất cả chức năng vote.' 
                                : 'User này sẽ bị chặn khi cố gắng vote.'
                            }
                        </Typography>
                    </Alert>
                )}

                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        <strong>API Endpoint:</strong><br />
                        GET /Voting/validate-voter?votingId={votingId}&stakeId={stakeId}
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleClose} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VoterValidationTestDialog;