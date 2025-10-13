import React from 'react';
import { Card, CardContent, CardActions, Typography, Chip, Button, LinearProgress, Box } from '@mui/material';
import { Proposal } from '@/types/daoVoting.type';
import { ProposalStatus, ProposalType } from '@/enums/DAOVoting';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface ProposalCardProps {
    proposal: Proposal;
    onVote?: (proposalId: string) => void;
    showVoteButton?: boolean;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ 
    proposal, 
    onVote, 
    showVoteButton = true 
}) => {
    const getStatusColor = (status: ProposalStatus) => {
        switch (status) {
            case ProposalStatus.ACTIVE:
                return 'primary';
            case ProposalStatus.PASSED:
                return 'success';
            case ProposalStatus.REJECTED:
                return 'error';
            case ProposalStatus.EXPIRED:
                return 'warning';
            case ProposalStatus.DRAFT:
                return 'info';
            default:
                return 'default';
        }
    };

    const getTypeColor = (type: ProposalType) => {
        switch (type) {
            case ProposalType.CONSTITUTIONAL:
                return 'error';
            case ProposalType.TREASURY:
                return 'success';
            case ProposalType.PARAMETER_CHANGE:
                return 'warning';
            case ProposalType.HARD_FORK:
                return 'error';
            default:
                return 'info';
        }
    };

    const getVotingProgress = () => {
        const totalVotes = proposal.yesVotes + proposal.noVotes + proposal.abstainVotes;
        if (totalVotes === 0) return 0;
        
        const yesPercentage = (proposal.yesVotes / totalVotes) * 100;
        return yesPercentage;
    };

    const isVotingActive = () => {
        const now = new Date();
        return proposal.status === ProposalStatus.ACTIVE && 
               new Date(proposal.votingEnd) > now;
    };

    const timeRemaining = () => {
        const now = new Date();
        const end = new Date(proposal.votingEnd);
        const diff = end.getTime() - now.getTime();
        
        if (diff <= 0) return 'Voting ended';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) return `${days} days remaining`;
        return `${hours} hours remaining`;
    };

    return (
        <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Chip 
                            label={proposal.status} 
                            color={getStatusColor(proposal.status)} 
                            size="small" 
                            sx={{ mr: 1 }}
                        />
                        <Chip 
                            label={proposal.type} 
                            color={getTypeColor(proposal.type)} 
                            size="small" 
                            variant="outlined"
                        />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {timeRemaining()}
                    </Typography>
                </Box>

                <Typography variant="h6" component="h3" gutterBottom>
                    {proposal.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                    {proposal.description.length > 200 
                        ? `${proposal.description.substring(0, 200)}...` 
                        : proposal.description
                    }
                </Typography>

                <Box mb={2}>
                    <Typography variant="caption" color="text.secondary">
                        Voting Progress
                    </Typography>
                    <LinearProgress 
                        variant="determinate" 
                        value={getVotingProgress()} 
                        sx={{ mt: 1, mb: 1 }}
                        color={getVotingProgress() > 50 ? 'success' : 'warning'}
                    />
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="caption">
                            Yes: {proposal.yesVotes} ({Math.round((proposal.yesVotes / (proposal.yesVotes + proposal.noVotes + proposal.abstainVotes)) * 100) || 0}%)
                        </Typography>
                        <Typography variant="caption">
                            No: {proposal.noVotes} ({Math.round((proposal.noVotes / (proposal.yesVotes + proposal.noVotes + proposal.abstainVotes)) * 100) || 0}%)
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                        Created: {format(new Date(proposal.createdAt), 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Total Votes: {proposal.totalVotes}
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button 
                    component={Link} 
                    to={`/dao/proposals/${proposal.id}`}
                    size="small"
                >
                    View Details
                </Button>
                
                {showVoteButton && isVotingActive() && (
                    <Button 
                        variant="contained" 
                        size="small"
                        onClick={() => onVote?.(proposal.id)}
                        color="primary"
                    >
                        Vote Now
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default ProposalCard;