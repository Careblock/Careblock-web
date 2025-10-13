import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Paper,
    Chip,
    Skeleton,
} from '@mui/material';
import { Add, FilterList } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProposalCard from '@/components/dao/ProposalCard';
import GovernanceStatsCard from '@/components/dao/GovernanceStatsCard';
import VotingDialog from '@/components/dao/VotingDialog';
import { Proposal, ProposalFilter } from '@/types/daoVoting.type';
import { ProposalStatus, ProposalType, ProposalCategory } from '@/enums/DAOVoting';
import ProposalService from '@/services/proposal.service';

const DAOProposalsPage: React.FC = () => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [votingDialog, setVotingDialog] = useState<{ open: boolean; proposalId: string; proposalTitle: string }>({
        open: false,
        proposalId: '',
        proposalTitle: '',
    });
    const [filter, setFilter] = useState<ProposalFilter>({});
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        loadProposals();
        loadStats();
    }, [filter]);

    const loadProposals = async () => {
        setLoading(true);
        try {
            ProposalService.getAllProposals(filter).subscribe({
                next: (data) => {
                    setProposals(data);
                    setLoading(false);
                },
                error: (error) => {
                    console.error('Error loading proposals:', error);
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error('Error loading proposals:', error);
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            ProposalService.getGovernanceStats().subscribe({
                next: (data) => {
                    setStats(data);
                },
                error: (error) => {
                    console.error('Error loading stats:', error);
                }
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleVote = (proposalId: string) => {
        const proposal = proposals.find(p => p.id === proposalId);
        if (proposal) {
            setVotingDialog({
                open: true,
                proposalId,
                proposalTitle: proposal.title,
            });
        }
    };



    const handleFilterChange = (field: keyof ProposalFilter, value: any) => {
        setFilter(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearFilters = () => {
        setFilter({});
        setSearchText('');
    };

    const filteredProposals = proposals.filter(proposal =>
        searchText === '' || 
        proposal.title.toLowerCase().includes(searchText.toLowerCase()) ||
        proposal.description.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    DAO Governance
                </Typography>
                <Button
                    component={Link}
                    to="/dao/proposals/create"
                    variant="contained"
                    startIcon={<Add />}
                >
                    Create Proposal
                </Button>
            </Box>

            {/* Governance Stats */}
            {stats && (
                <Box mb={4}>
                    <GovernanceStatsCard stats={stats} />
                </Box>
            )}

            {/* Filters */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <FilterList sx={{ mr: 1 }} />
                    <Typography variant="h6">Filters</Typography>
                </Box>
                
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                multiple
                                value={filter.status || []}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                renderValue={(selected) => (
                                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                                        {(selected as string[]).map((value) => (
                                            <Chip key={value} label={value} size="small" />
                                        ))}
                                    </Box>
                                )}
                            >
                                {Object.values(ProposalStatus).map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Type</InputLabel>
                            <Select
                                multiple
                                value={filter.type || []}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                renderValue={(selected) => (
                                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                                        {(selected as string[]).map((value) => (
                                            <Chip key={value} label={value} size="small" />
                                        ))}
                                    </Box>
                                )}
                            >
                                {Object.values(ProposalType).map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Category</InputLabel>
                            <Select
                                multiple
                                value={filter.category || []}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                renderValue={(selected) => (
                                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                                        {(selected as string[]).map((value) => (
                                            <Chip key={value} label={value} size="small" />
                                        ))}
                                    </Box>
                                )}
                            >
                                {Object.values(ProposalCategory).map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={1}>
                        <Button variant="outlined" onClick={clearFilters} fullWidth>
                            Clear
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Proposals List */}
            <Grid container spacing={3}>
                {loading ? (
                    // Loading skeletons
                    Array.from({ length: 6 }).map((_, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Skeleton variant="rectangular" height={200} />
                        </Grid>
                    ))
                ) : filteredProposals.length === 0 ? (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                No proposals found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Try adjusting your filters or create a new proposal
                            </Typography>
                        </Paper>
                    </Grid>
                ) : (
                    filteredProposals.map((proposal) => (
                        <Grid item xs={12} md={6} key={proposal.id}>
                            <ProposalCard
                                proposal={proposal}
                                onVote={handleVote}
                                showVoteButton={true}
                            />
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Voting Dialog */}
            <VotingDialog
                open={votingDialog.open}
                onClose={() => setVotingDialog({ open: false, proposalId: '', proposalTitle: '' })}
                onVoteSuccess={loadProposals}
                proposalId={votingDialog.proposalId}
                proposalTitle={votingDialog.proposalTitle}
            />
        </Container>
    );
};

export default DAOProposalsPage;