import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    HowToVote,
    Assessment,
    RemoveCircle,
    AccessTime,
    Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import VotingDialog from '@/components/dao/VotingDialog';
import VotingDetailDialog from '@/components/dao/VotingDetailDialog';
import CreateProposalDialog from '@/components/dao/CreateProposalDialog';
import LoginRequiredDialog from '@/components/dao/LoginRequiredDialog';
import SuccessDialog from '@/components/dao/SuccessDialog';
import ErrorDialog from '@/components/dao/ErrorDialog';
import TransactionIdChip from '@/components/dao/TransactionIdChip';
import useObservable from '@/hooks/use-observable.hook';
import VotingApiService, { VotingItem, VotingApiResponse } from '@/services/votingApi.service';
import { isUserLoggedIn, getStakeIdFromCookies } from '@/utils/cookie.utils';

// Helper function to determine if voting is still active
const isVotingActive = (endDate: string): boolean => {
    return new Date(endDate) > new Date();
};

// Helper function to get voting status
const getVotingStatus = (endDate: string): 'ACTIVE' | 'EXPIRED' => {
    return isVotingActive(endDate) ? 'ACTIVE' : 'EXPIRED';
};

// Helper function to format time remaining
const getTimeRemaining = (endDate: string): string => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Voting ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days remaining`;
    return `${hours} hours remaining`;
};

const DAOVotingPage: React.FC = () => {
    const navigate = useNavigate();
    const { subscribeOnce } = useObservable();
    
    const [votingDialog, setVotingDialog] = useState<{
        open: boolean;
        proposalId: string;
        proposalTitle: string;
    }>({
        open: false,
        proposalId: '',
        proposalTitle: '',
    });

    const [detailDialog, setDetailDialog] = useState<{
        open: boolean;
        votingId: string;
    }>({
        open: false,
        votingId: '',
    });

    const [createDialog, setCreateDialog] = useState(false);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    
    const [loginDialog, setLoginDialog] = useState<{
        open: boolean;
        title: string;
        message: string;
        actionType: 'create_proposal' | 'vote' | 'general';
        showLoginButton?: boolean;
    }>({
        open: false,
        title: '',
        message: '',
        actionType: 'general'
    });

    const [successDialog, setSuccessDialog] = useState<{
        open: boolean;
        title: string;
        message: string;
        actionType: 'vote_success' | 'proposal_created' | 'general';
        details?: {
            id?: string;
            transactionId?: string;
        };
    }>({
        open: false,
        title: '',
        message: '',
        actionType: 'general'
    });

    const [errorDialog, setErrorDialog] = useState<{
        open: boolean;
        title: string;
        message: string;
        errorType: 'vote_error' | 'proposal_error' | 'wallet_error' | 'general';
        details?: {
            transactionId?: string;
            proposalId?: string;
        };
    }>({
        open: false,
        title: '',
        message: '',
        errorType: 'general'
    });
    
    // API data states
    const [activeVotings, setActiveVotings] = useState<VotingItem[]>([]);
    const [allVotings, setAllVotings] = useState<VotingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showAll, setShowAll] = useState(false);

    // Load voting data when component mounts
    useEffect(() => {
        loadVotingData();
        // Check login status
        setUserLoggedIn(isUserLoggedIn());
    }, []);    const loadVotingData = () => {
        setLoading(true);
        setError(null);
        
        try {
            // Load active votings first (primary focus)
            subscribeOnce(
                VotingApiService.getActiveVotings(),
                (response: VotingApiResponse) => {
                    console.log('Received active votings:', response);
                    
                    if (response && response.votings && Array.isArray(response.votings)) {
                        setActiveVotings(response.votings);
                        
                        // Also load inactive for "show all" option
                        loadInactiveVotings(response.votings);
                    } else {
                        console.error('Invalid response structure:', response);
                        setError('Invalid data format received from server.');
                        setLoading(false);
                    }
                }
            );
        } catch (err) {
            console.error('Error loading voting data:', err);
            setError('Failed to load voting data. Please try again.');
            setLoading(false);
        }
    };

    const loadInactiveVotings = (activeVotings: VotingItem[]) => {
        try {
            subscribeOnce(
                VotingApiService.getAllInactiveVotings(1, 10),
                (inactiveResponse: VotingApiResponse) => {
                    console.log('Received inactive votings:', inactiveResponse);
                    
                    if (inactiveResponse && inactiveResponse.votings && Array.isArray(inactiveResponse.votings)) {
                        // Combine active and inactive
                        const combined = [...activeVotings, ...inactiveResponse.votings];
                        setAllVotings(combined);
                    } else {
                        setAllVotings(activeVotings);
                    }
                    setLoading(false);
                }
            );
        } catch (err) {
            console.error('Error loading inactive votings:', err);
            setAllVotings(activeVotings);
            setLoading(false);
        }
    };

    const handleVote = async (votingId: string) => {
        if (!userLoggedIn) {
            setLoginDialog({
                open: true,
                title: 'Authentication Required',
                message: 'Please login first to cast your vote. Your wallet authentication is required for secure voting.',
                actionType: 'vote'
            });
            return;
        }

        const currentVotings = showAll ? allVotings : activeVotings;
        const voting = currentVotings.find(v => v.id === votingId);
        if (!voting) return;

        // First validate if user can vote
        try {
            const stakeId = getStakeIdFromCookies();
            if (!stakeId) {
                setLoginDialog({
                    open: true,
                    title: 'Authentication Required',
                    message: 'Unable to find your Stake ID. Please login again to ensure proper authentication.',
                    actionType: 'vote'
                });
                return;
            }
            
            VotingApiService.validateVoter(votingId, stakeId).subscribe({
                next: (response) => {
                    if (response.canVote) {
                        setVotingDialog({
                            open: true,
                            proposalId: votingId,
                            proposalTitle: voting.title,
                        });
                    } else {
                        setLoginDialog({
                            open: true,
                            title: 'Already Voted',
                            message: 'You have already voted on this proposal. Each wallet can only vote once per proposal to ensure fair voting.',
                            actionType: 'vote',
                            showLoginButton: false
                        });
                    }
                },
                error: (error) => {
                    console.error('Error validating voter:', error);
                    // On validation error, block voting for security (fail-closed)
                    setLoginDialog({
                        open: true,
                        title: 'Verification Failed',
                        message: 'Unable to verify your voting permission. The system cannot confirm your voting rights. Please try again later or contact the administrator.',
                        actionType: 'vote'
                    });
                }
            });
        } catch (error) {
            console.error('Error validating voter:', error);
            // On validation error, block voting for security (fail-closed)
            setLoginDialog({
                open: true,
                title: 'System Error',
                message: 'An unexpected error occurred while verifying your voting permission. The system cannot confirm your voting rights. Please try again later or contact the administrator.',
                actionType: 'vote'
            });
        }
    };



    const handleViewDetail = (votingId: string) => {
        setDetailDialog({
            open: true,
            votingId: votingId,
        });
    };

    const handleCloseDetail = () => {
        setDetailDialog({ open: false, votingId: '' });
    };

    const handleCreateProposal = () => {
        if (userLoggedIn) {
            setCreateDialog(true);
        } else {
            setLoginDialog({
                open: true,
                title: 'Login Required',
                message: 'Please login first to create proposals. Your wallet authentication is required to ensure ownership and prevent spam.',
                actionType: 'create_proposal'
            });
        }
    };

    const handleCreateSuccess = (proposalId: string, transactionId?: string) => {
        console.log('Proposal created successfully with ID:', proposalId, 'Transaction ID:', transactionId);
        // Show success dialog
        setSuccessDialog({
            open: true,
            title: 'Proposal Created Successfully!',
            message: 'Your proposal has been submitted and is now available for community voting.',
            actionType: 'proposal_created',
            details: {
                id: proposalId,
                transactionId: transactionId
            }
        });
        // Refresh data to show new proposal
        loadVotingData();
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <HowToVote color="primary" />;
            case 'EXPIRED':
                return <AccessTime color="warning" />;
            default:
                return <RemoveCircle color="disabled" />;
        }
    };

    const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
        switch (status) {
            case 'ACTIVE':
                return 'primary';
            case 'EXPIRED':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h3" component="h1" gutterBottom>
                        🗳️ DAO Governance Voting
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Participate in decentralized decision making for CareBlock platform
                    </Typography>
                </Box>
                <Box display="flex" gap={2}>
                    <Button
                        variant="contained"
                        onClick={handleCreateProposal}
                        startIcon={<AddIcon />}
                        sx={{ 
                            minWidth: 160,
                            opacity: userLoggedIn ? 1 : 0.6
                        }}
                        title={userLoggedIn ? "Create a new proposal" : "Please login first to create proposals"}
                    >
                        Create Proposal
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                        sx={{ minWidth: 120 }}
                    >
                        Back to Home
                    </Button>
                </Box>
            </Box>

            {/* Stats Overview */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Assessment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h4" color="primary">
                                {allVotings.length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Total Proposals
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <HowToVote sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                            <Typography variant="h4" color="secondary">
                                {activeVotings.length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Active Proposals
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Loading State */}
            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                    <Typography variant="body1" ml={2}>Loading voting data...</Typography>
                </Box>
            )}

            {/* Error State */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                    <Button color="inherit" size="small" onClick={loadVotingData} sx={{ ml: 2 }}>
                        Retry
                    </Button>
                </Alert>
            )}

            {/* Voting Proposals */}
            {!loading && !error && (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5">
                            🗳️ {showAll ? 'All' : 'Active'} Voting Proposals ({showAll ? allVotings.length : activeVotings.length})
                        </Typography>
                        <Box>
                            <Button
                                variant={!showAll ? "contained" : "outlined"}
                                onClick={() => setShowAll(false)}
                                sx={{ mr: 1 }}
                            >
                                Active Only ({activeVotings.length})
                            </Button>
                            <Button
                                variant={showAll ? "contained" : "outlined"}
                                onClick={() => setShowAll(true)}
                            >
                                Show All ({allVotings.length})
                            </Button>
                        </Box>
                    </Box>
                    
                    {(() => {
                        const currentVotings = showAll ? allVotings : activeVotings;
                        return currentVotings.length === 0 ? (
                            <Card sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary">
                                    No {showAll ? '' : 'active '}voting proposals found
                                </Typography>
                            </Card>
                        ) : (
                            <Grid container spacing={3}>
                                {currentVotings.map((voting) => {
                                const status = getVotingStatus(voting.endDate);
                                const isActive = status === 'ACTIVE';
                                
                                return (
                                    <Grid item xs={12} md={6} key={voting.id}>
                                        <Card sx={{ 
                                            height: '100%', 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            opacity: isActive ? 1 : 0.7
                                        }}>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        {getStatusIcon(status)}
                                                        <Chip 
                                                            label={status} 
                                                            color={getStatusColor(status)} 
                                                            size="small" 
                                                        />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {getTimeRemaining(voting.endDate)}
                                                    </Typography>
                                                </Box>

                                                <Typography variant="h6" gutterBottom>
                                                    {voting.title}
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    <strong>Problem:</strong> {voting.problemSummary}
                                                </Typography>

                                                {voting.problemDetail && (
                                                    <Typography variant="body2" color="text.secondary" paragraph>
                                                        {voting.problemDetail.length > 100 
                                                            ? `${voting.problemDetail.substring(0, 100)}...`
                                                            : voting.problemDetail
                                                        }
                                                    </Typography>
                                                )}

                                                {voting.solution && (
                                                    <Typography variant="body2" color="primary.main" paragraph>
                                                        <strong>Solution:</strong> {voting.solution.length > 80 
                                                            ? `${voting.solution.substring(0, 80)}...`
                                                            : voting.solution
                                                        }
                                                    </Typography>
                                                )}

                                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Created: {format(new Date(voting.createdAt), 'MMM dd, yyyy')}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        End: {format(new Date(voting.endDate), 'MMM dd, yyyy HH:mm')}
                                                    </Typography>
                                                </Box>

                                                {/* Proposal Transaction ID */}
                                                {voting.transactionId && (
                                                    <Box display="flex" alignItems="center" gap={1} mt={2}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Proposal Tx:
                                                        </Typography>
                                                        <TransactionIdChip 
                                                            transactionId={voting.transactionId} 
                                                            label="Proposal Transaction"
                                                            size="small"
                                                        />
                                                    </Box>
                                                )}
                                            </CardContent>

                                            <Box p={2} pt={0}>
                                                <Box display="flex" gap={1} mb={1}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => handleViewDetail(voting.id)}
                                                        sx={{ flex: '1' }}
                                                    >
                                                        View Details
                                                    </Button>
                                                </Box>
                                                <Button
                                                    fullWidth
                                                    variant={isActive ? "contained" : "outlined"}
                                                    size="large"
                                                    onClick={() => handleVote(voting.id)}
                                                    startIcon={<HowToVote />}
                                                    disabled={!isActive}
                                                    sx={isActive ? { 
                                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                                    } : {}}
                                                >
                                                    {isActive ? 'Cast Your Vote' : 'Voting Ended'}
                                                </Button>
                                            </Box>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        );
                    })()}
                </>
            )}

            {/* Voting Dialog */}
            <VotingDialog
                open={votingDialog.open}
                onClose={() => setVotingDialog({ open: false, proposalId: '', proposalTitle: '' })}
                onVoteSuccess={(transactionId) => {
                    // Close voting dialog first
                    setVotingDialog({ open: false, proposalId: '', proposalTitle: '' });
                    
                    // Use setTimeout to ensure voting dialog closes before showing success dialog
                    setTimeout(() => {
                        // Show success dialog with transaction ID
                        setSuccessDialog({
                            open: true,
                            title: 'Vote Submitted Successfully!',
                            message: 'Your vote has been recorded on the blockchain and will be counted in the final results.',
                            actionType: 'vote_success',
                            details: {
                                transactionId: transactionId
                            }
                        });
                    }, 100);
                    
                    // Refresh voting data
                    loadVotingData();
                }}
                onVoteError={(error) => {
                    // Close voting dialog first
                    setVotingDialog({ open: false, proposalId: '', proposalTitle: '' });
                    
                    // Determine error type based on error message
                    let errorType: 'vote_error' | 'wallet_error' | 'general' = 'general';
                    if (error.includes('wallet') || error.includes('declined') || error.includes('Eternl')) {
                        errorType = 'wallet_error';
                    } else if (error.includes('vote') || error.includes('submission')) {
                        errorType = 'vote_error';
                    }
                    
                    // Show error dialog
                    setErrorDialog({
                        open: true,
                        title: 'Vote Failed',
                        message: error,
                        errorType: errorType,
                        details: {
                            proposalId: votingDialog.proposalId
                        }
                    });
                }}
                proposalId={votingDialog.proposalId}
                proposalTitle={votingDialog.proposalTitle}
            />

            {/* Voting Detail Dialog */}
            <VotingDetailDialog
                open={detailDialog.open}
                onClose={handleCloseDetail}
                votingId={detailDialog.votingId}
            />

            {/* Create Proposal Dialog */}
            <CreateProposalDialog
                open={createDialog}
                onClose={() => setCreateDialog(false)}
                onSuccess={handleCreateSuccess}
                onError={(error) => {
                    // Close create dialog first
                    setCreateDialog(false);
                    
                    // Determine error type
                    let errorType: 'proposal_error' | 'wallet_error' | 'general' = 'general';
                    if (error.includes('wallet') || error.includes('declined') || error.includes('Eternl')) {
                        errorType = 'wallet_error';
                    } else if (error.includes('proposal') || error.includes('create')) {
                        errorType = 'proposal_error';
                    }
                    
                    // Show error dialog
                    setErrorDialog({
                        open: true,
                        title: 'Proposal Creation Failed',
                        message: error,
                        errorType: errorType
                    });
                }}
            />

            {/* Login Required Dialog */}
            <LoginRequiredDialog
                open={loginDialog.open}
                onClose={() => setLoginDialog({ ...loginDialog, open: false })}
                title={loginDialog.title}
                message={loginDialog.message}
                actionType={loginDialog.actionType}
                showLoginButton={loginDialog.showLoginButton}
            />

            {/* Success Dialog */}
            <SuccessDialog
                open={successDialog.open}
                onClose={() => setSuccessDialog({ ...successDialog, open: false })}
                title={successDialog.title}
                message={successDialog.message}
                actionType={successDialog.actionType}
                details={successDialog.details}
            />

            {/* Error Dialog */}
            <ErrorDialog
                open={errorDialog.open}
                onClose={() => setErrorDialog({ ...errorDialog, open: false })}
                title={errorDialog.title}
                message={errorDialog.message}
                errorType={errorDialog.errorType}
                details={errorDialog.details}
            />
        </Container>
    );
};

export default DAOVotingPage;