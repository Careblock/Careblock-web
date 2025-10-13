import { Proposal, ProposalFilter, GovernanceStats, GovernanceMetrics } from '@/types/daoVoting.type';

export interface ProposalState {
    proposals: Proposal[];
    currentProposal: Proposal | null;
    filter: ProposalFilter;
    loading: boolean;
    error: string | null;
    governanceStats: GovernanceStats | null;
    governanceMetrics: GovernanceMetrics | null;
}

export const initialProposalState: ProposalState = {
    proposals: [],
    currentProposal: null,
    filter: {},
    loading: false,
    error: null,
    governanceStats: null,
    governanceMetrics: null,
};

export enum ProposalActionType {
    // Loading states
    SET_LOADING = 'PROPOSAL_SET_LOADING',
    SET_ERROR = 'PROPOSAL_SET_ERROR',
    CLEAR_ERROR = 'PROPOSAL_CLEAR_ERROR',

    // Proposals
    SET_PROPOSALS = 'PROPOSAL_SET_PROPOSALS',
    ADD_PROPOSAL = 'PROPOSAL_ADD_PROPOSAL',
    UPDATE_PROPOSAL = 'PROPOSAL_UPDATE_PROPOSAL',
    DELETE_PROPOSAL = 'PROPOSAL_DELETE_PROPOSAL',

    // Current proposal
    SET_CURRENT_PROPOSAL = 'PROPOSAL_SET_CURRENT_PROPOSAL',
    CLEAR_CURRENT_PROPOSAL = 'PROPOSAL_CLEAR_CURRENT_PROPOSAL',

    // Filter
    SET_FILTER = 'PROPOSAL_SET_FILTER',
    CLEAR_FILTER = 'PROPOSAL_CLEAR_FILTER',

    // Stats and metrics
    SET_GOVERNANCE_STATS = 'PROPOSAL_SET_GOVERNANCE_STATS',
    SET_GOVERNANCE_METRICS = 'PROPOSAL_SET_GOVERNANCE_METRICS',
}

export interface ProposalAction {
    type: ProposalActionType;
    payload?: any;
}

export const proposalReducer = (state: ProposalState = initialProposalState, action: ProposalAction): ProposalState => {
    switch (action.type) {
        case ProposalActionType.SET_LOADING:
            return { ...state, loading: action.payload };

        case ProposalActionType.SET_ERROR:
            return { ...state, error: action.payload, loading: false };

        case ProposalActionType.CLEAR_ERROR:
            return { ...state, error: null };

        case ProposalActionType.SET_PROPOSALS:
            return { ...state, proposals: action.payload, loading: false };

        case ProposalActionType.ADD_PROPOSAL:
            return { ...state, proposals: [action.payload, ...state.proposals] };

        case ProposalActionType.UPDATE_PROPOSAL:
            return {
                ...state,
                proposals: state.proposals.map(proposal =>
                    proposal.id === action.payload.id ? action.payload : proposal
                ),
                currentProposal: state.currentProposal?.id === action.payload.id ? action.payload : state.currentProposal,
            };

        case ProposalActionType.DELETE_PROPOSAL:
            return {
                ...state,
                proposals: state.proposals.filter(proposal => proposal.id !== action.payload),
                currentProposal: state.currentProposal?.id === action.payload ? null : state.currentProposal,
            };

        case ProposalActionType.SET_CURRENT_PROPOSAL:
            return { ...state, currentProposal: action.payload, loading: false };

        case ProposalActionType.CLEAR_CURRENT_PROPOSAL:
            return { ...state, currentProposal: null };

        case ProposalActionType.SET_FILTER:
            return { ...state, filter: { ...state.filter, ...action.payload } };

        case ProposalActionType.CLEAR_FILTER:
            return { ...state, filter: {} };

        case ProposalActionType.SET_GOVERNANCE_STATS:
            return { ...state, governanceStats: action.payload };

        case ProposalActionType.SET_GOVERNANCE_METRICS:
            return { ...state, governanceMetrics: action.payload };

        default:
            return state;
    }
};