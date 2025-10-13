import { Vote, Voter, GovernanceActivity } from '@/types/daoVoting.type';

export interface VotingState {
    votes: Vote[];
    currentVoter: Voter | null;
    voterVotes: Vote[];
    governanceActivity: GovernanceActivity[];
    loading: boolean;
    error: string | null;
    votingInProgress: boolean;
    delegationInProgress: boolean;
}

export const initialVotingState: VotingState = {
    votes: [],
    currentVoter: null,
    voterVotes: [],
    governanceActivity: [],
    loading: false,
    error: null,
    votingInProgress: false,
    delegationInProgress: false,
};

export enum VotingActionType {
    // Loading states
    SET_LOADING = 'VOTING_SET_LOADING',
    SET_ERROR = 'VOTING_SET_ERROR',
    CLEAR_ERROR = 'VOTING_CLEAR_ERROR',
    SET_VOTING_IN_PROGRESS = 'VOTING_SET_VOTING_IN_PROGRESS',
    SET_DELEGATION_IN_PROGRESS = 'VOTING_SET_DELEGATION_IN_PROGRESS',

    // Votes
    SET_VOTES = 'VOTING_SET_VOTES',
    ADD_VOTE = 'VOTING_ADD_VOTE',
    UPDATE_VOTE = 'VOTING_UPDATE_VOTE',

    // Voter
    SET_CURRENT_VOTER = 'VOTING_SET_CURRENT_VOTER',
    UPDATE_CURRENT_VOTER = 'VOTING_UPDATE_CURRENT_VOTER',
    CLEAR_CURRENT_VOTER = 'VOTING_CLEAR_CURRENT_VOTER',

    // Voter votes
    SET_VOTER_VOTES = 'VOTING_SET_VOTER_VOTES',

    // Governance activity
    SET_GOVERNANCE_ACTIVITY = 'VOTING_SET_GOVERNANCE_ACTIVITY',
    ADD_GOVERNANCE_ACTIVITY = 'VOTING_ADD_GOVERNANCE_ACTIVITY',
}

export interface VotingAction {
    type: VotingActionType;
    payload?: any;
}

export const votingReducer = (state: VotingState = initialVotingState, action: VotingAction): VotingState => {
    switch (action.type) {
        case VotingActionType.SET_LOADING:
            return { ...state, loading: action.payload };

        case VotingActionType.SET_ERROR:
            return { ...state, error: action.payload, loading: false };

        case VotingActionType.CLEAR_ERROR:
            return { ...state, error: null };

        case VotingActionType.SET_VOTING_IN_PROGRESS:
            return { ...state, votingInProgress: action.payload };

        case VotingActionType.SET_DELEGATION_IN_PROGRESS:
            return { ...state, delegationInProgress: action.payload };

        case VotingActionType.SET_VOTES:
            return { ...state, votes: action.payload, loading: false };

        case VotingActionType.ADD_VOTE:
            return { ...state, votes: [...state.votes, action.payload] };

        case VotingActionType.UPDATE_VOTE:
            return {
                ...state,
                votes: state.votes.map(vote =>
                    vote.id === action.payload.id ? action.payload : vote
                ),
            };

        case VotingActionType.SET_CURRENT_VOTER:
            return { ...state, currentVoter: action.payload, loading: false };

        case VotingActionType.UPDATE_CURRENT_VOTER:
            return { 
                ...state, 
                currentVoter: state.currentVoter ? { ...state.currentVoter, ...action.payload } : null 
            };

        case VotingActionType.CLEAR_CURRENT_VOTER:
            return { ...state, currentVoter: null };

        case VotingActionType.SET_VOTER_VOTES:
            return { ...state, voterVotes: action.payload };

        case VotingActionType.SET_GOVERNANCE_ACTIVITY:
            return { ...state, governanceActivity: action.payload };

        case VotingActionType.ADD_GOVERNANCE_ACTIVITY:
            return { 
                ...state, 
                governanceActivity: [action.payload, ...state.governanceActivity] 
            };

        default:
            return state;
    }
};