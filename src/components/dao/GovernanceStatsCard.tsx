import React from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Box, 
    Chip,
    LinearProgress,
    Divider
} from '@mui/material';
import { GovernanceStats } from '@/types/daoVoting.type';
import { 
    HowToVote,
    People,
    Assessment,
    TrendingUp 
} from '@mui/icons-material';

interface GovernanceStatsCardProps {
    stats: GovernanceStats;
}

const GovernanceStatsCard: React.FC<GovernanceStatsCardProps> = ({ stats }) => {
    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const getParticipationColor = (rate: number) => {
        if (rate >= 70) return 'success';
        if (rate >= 50) return 'warning';
        return 'error';
    };

    const totalVotesCast = stats.voteDistribution.yes + stats.voteDistribution.no + stats.voteDistribution.abstain;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Governance Overview
                </Typography>

                <Grid container spacing={3}>
                    {/* Key Metrics */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Box textAlign="center">
                            <Box display="flex" justifyContent="center" mb={1}>
                                <Assessment color="primary" />
                            </Box>
                            <Typography variant="h4" color="primary">
                                {stats.totalProposals}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Total Proposals
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Box textAlign="center">
                            <Box display="flex" justifyContent="center" mb={1}>
                                <HowToVote color="secondary" />
                            </Box>
                            <Typography variant="h4" color="secondary">
                                {stats.activeProposals}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Active Proposals
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Box textAlign="center">
                            <Box display="flex" justifyContent="center" mb={1}>
                                <People color="success" />
                            </Box>
                            <Typography variant="h4" color="success.main">
                                {formatNumber(stats.totalVoters)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Total Voters
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Box textAlign="center">
                            <Box display="flex" justifyContent="center" mb={1}>
                                <TrendingUp color="warning" />
                            </Box>
                            <Typography variant="h4" color="warning.main">
                                {stats.participationRate.toFixed(1)}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Participation Rate
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Participation Progress */}
                <Box mb={3}>
                    <Typography variant="subtitle2" gutterBottom>
                        Participation Rate
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={stats.participationRate}
                        color={getParticipationColor(stats.participationRate)}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {stats.participationRate.toFixed(1)}% of eligible voters have participated
                    </Typography>
                </Box>

                {/* Proposal Types Distribution */}
                <Box mb={3}>
                    <Typography variant="subtitle2" gutterBottom>
                        Proposals by Type
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {Object.entries(stats.proposalsByType).map(([type, count]) => (
                            <Chip
                                key={type}
                                label={`${type}: ${count}`}
                                size="small"
                                variant="outlined"
                                color="primary"
                            />
                        ))}
                    </Box>
                </Box>

                {/* Vote Distribution */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Vote Distribution
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Box textAlign="center">
                                <Typography variant="h6" color="success.main">
                                    {formatNumber(stats.voteDistribution.yes)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Yes Votes
                                </Typography>
                                <Typography variant="caption" display="block">
                                    {totalVotesCast > 0 ? ((stats.voteDistribution.yes / totalVotesCast) * 100).toFixed(1) : 0}%
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box textAlign="center">
                                <Typography variant="h6" color="error.main">
                                    {formatNumber(stats.voteDistribution.no)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    No Votes
                                </Typography>
                                <Typography variant="caption" display="block">
                                    {totalVotesCast > 0 ? ((stats.voteDistribution.no / totalVotesCast) * 100).toFixed(1) : 0}%
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box textAlign="center">
                                <Typography variant="h6" color="warning.main">
                                    {formatNumber(stats.voteDistribution.abstain)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Abstain
                                </Typography>
                                <Typography variant="caption" display="block">
                                    {totalVotesCast > 0 ? ((stats.voteDistribution.abstain / totalVotesCast) * 100).toFixed(1) : 0}%
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GovernanceStatsCard;