import { ProposalType, ProposalStatus, VoteChoice, GovernanceRole, VotingPower, ProposalCategory } from '@/enums/DAOVoting';

export interface Proposal {
    id: string;
    title: string;
    description: string;
    type: ProposalType;
    category: ProposalCategory;
    status: ProposalStatus;
    createdBy: string;
    createdAt: Date;
    votingStart: Date;
    votingEnd: Date;
    totalVotes: number;
    yesVotes: number;
    noVotes: number;
    abstainVotes: number;
    requiredThreshold: number;
    metadata?: {
        [key: string]: any;
    };
    documents?: ProposalDocument[];
    rationale: string;
    impact?: string;
    implementation?: string;
}

export interface ProposalDocument {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
}

export interface Vote {
    id: string;
    proposalId: string;
    voterId: string;
    choice: VoteChoice;
    votingPower: number;
    timestamp: Date;
    transactionHash?: string;
    rationale?: string;
}

export interface Voter {
    id: string;
    address: string;
    role: GovernanceRole;
    votingPower: number;
    votingPowerTier: VotingPower;
    reputation: number;
    totalVotesCast: number;
    joinedAt: Date;
    isActive: boolean;
    delegatedTo?: string;
    delegatesFrom?: string[];
}

export interface GovernanceStats {
    totalProposals: number;
    activeProposals: number;
    totalVoters: number;
    totalVotingPower: number;
    participationRate: number;
    proposalsByType: {
        [key in ProposalType]: number;
    };
    voteDistribution: {
        yes: number;
        no: number;
        abstain: number;
    };
}

export interface CreateProposalRequest {
    title: string;
    description: string;
    type: ProposalType;
    category: ProposalCategory;
    rationale: string;
    impact?: string;
    implementation?: string;
    documents?: File[];
    votingDuration: number; // in days
}

export interface VoteRequest {
    proposalId: string;
    choice: VoteChoice;
    rationale?: string;
    [key: string]: any;
}

export interface ProposalFilter {
    status?: ProposalStatus[];
    type?: ProposalType[];
    category?: ProposalCategory[];
    createdBy?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: 'createdAt' | 'votingEnd' | 'totalVotes';
    sortOrder?: 'asc' | 'desc';
}

export interface DelegationRequest {
    delegateToAddress: string;
    votingPower?: number;
    [key: string]: any;
}

export interface GovernanceMetrics {
    proposalSuccessRate: number;
    averageParticipation: number;
    mostActiveVoters: Voter[];
    recentActivity: GovernanceActivity[];
}

export interface GovernanceActivity {
    id: string;
    type: 'PROPOSAL_CREATED' | 'VOTE_CAST' | 'PROPOSAL_EXECUTED' | 'DELEGATION';
    userId: string;
    proposalId?: string;
    timestamp: Date;
    details: string;
}