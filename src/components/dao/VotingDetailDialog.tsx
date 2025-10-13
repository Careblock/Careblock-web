import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Divider,
    Paper,
    LinearProgress,
    Grid,
    Card,
    CardContent,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Close as CloseIcon,
    AccessTime as TimeIcon,
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    Remove as RemoveIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import VotingApiService, { VotingDetailResponse } from '../../services/votingApi.service';

interface VotingDetailDialogProps {
    open: boolean;
    onClose: () => void;
    votingId: string;
}

const VotingDetailDialog: React.FC<VotingDetailDialogProps> = ({
    open,
    onClose,
    votingId
}) => {
    const [detail, setDetail] = useState<VotingDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load detail when dialog opens
    useEffect(() => {
        if (open && votingId) {
            loadVotingDetail();
        }
    }, [open, votingId]);

    const loadVotingDetail = () => {
        setLoading(true);
        setError(null);
        
        const subscription = VotingApiService.getVotingDetail(votingId).subscribe({
            next: (response) => {
                console.log('Voting detail loaded:', response);
                setDetail(response);
                setLoading(false);
            },
            error: (err) => {
                console.error('Failed to load voting detail:', err);
                setError('Failed to load proposal details');
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    };



    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateTimeRemaining = (endDate: string) => {
        const now = new Date();
        const end = new Date(endDate);
        const diffMs = end.getTime() - now.getTime();
        
        if (diffMs <= 0) {
            return 'Ended';
        }
        
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (diffDays > 0) {
            return `${diffDays} days ${diffHours} hours`;
        } else {
            return `${diffHours} hours`;
        }
    };

    const getTotalVotes = () => {
        if (!detail) return 0;
        return detail.yesCount + detail.noCount + detail.abstainCount;
    };

    const getVotePercentage = (count: number) => {
        const total = getTotalVotes();
        return total > 0 ? Math.round((count / total) * 100) : 0;
    };



    const isExpired = () => {
        if (!detail) return false;
        return new Date(detail.endDate) <= new Date();
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
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
                    Proposal Details
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 3 }}>
                {loading && (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {detail && !loading && (
                    <Box>
                        {/* Header with Title and Status */}
                        <Box mb={3}>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {detail.title}
                            </Typography>
                            
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <Chip 
                                    label={isExpired() ? 'Ended' : 'Ongoing'} 
                                    color={isExpired() ? 'default' : 'success'}
                                    variant="filled"
                                />
                                <Box display="flex" alignItems="center" gap={1}>
                                    <TimeIcon color="action" fontSize="small" />
                                    <Typography variant="body2" color="text.secondary">
                                        {calculateTimeRemaining(detail.endDate)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <CalendarIcon color="action" fontSize="small" />
                                <Typography variant="body2" color="text.secondary">
                                    End Date: {formatDate(detail.endDate)}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Problem Summary */}
                        <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                            <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 600 }}>
                                Problem Summary
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                {detail.problemSummary}
                            </Typography>
                        </Paper>

                        {/* Problem Detail */}
                        <Box mb={3}>
                            <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 600 }}>
                                Problem Details
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                                {detail.problemDetail}
                            </Typography>
                        </Box>

                        {/* Solution */}
                        <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                            <Typography variant="h6" gutterBottom color="success.main" sx={{ fontWeight: 600 }}>
                                Proposed Solution
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                {detail.solution}
                            </Typography>
                        </Paper>

                        {/* Voting Results */}
                        <Card elevation={2} sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 600 }}>
                                    Voting Results
                                </Typography>
                                
                                <Grid container spacing={3}>
                                    {/* Yes Votes */}
                                    <Grid item xs={12} sm={4}>
                                        <Box textAlign="center">
                                            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                                                <ThumbUpIcon color="success" />
                                                <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                                                    Yes
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                                                {detail.yesCount}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {getVotePercentage(detail.yesCount)}%
                                            </Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={getVotePercentage(detail.yesCount)} 
                                                color="success"
                                                sx={{ mt: 1, height: 8, borderRadius: 1 }}
                                            />
                                        </Box>
                                    </Grid>

                                    {/* No Votes */}
                                    <Grid item xs={12} sm={4}>
                                        <Box textAlign="center">
                                            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                                                <ThumbDownIcon color="error" />
                                                <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                                                    No
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                                                {detail.noCount}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {getVotePercentage(detail.noCount)}%
                                            </Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={getVotePercentage(detail.noCount)} 
                                                color="error"
                                                sx={{ mt: 1, height: 8, borderRadius: 1 }}
                                            />
                                        </Box>
                                    </Grid>

                                    {/* Abstain Votes */}
                                    <Grid item xs={12} sm={4}>
                                        <Box textAlign="center">
                                            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                                                <RemoveIcon color="action" />
                                                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                    Abstain
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                                {detail.abstainCount}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {getVotePercentage(detail.abstainCount)}%
                                            </Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={getVotePercentage(detail.abstainCount)} 
                                                sx={{ mt: 1, height: 8, borderRadius: 1 }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    Total Votes: <strong>{getTotalVotes()}</strong>
                                </Typography>
                            </CardContent>
                        </Card>

                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} variant="outlined" size="large">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VotingDetailDialog;