import { combineReducers } from 'redux';
import { proposalReducer, ProposalState } from './proposal.store';
import { votingReducer, VotingState } from './voting.store';

export interface DAOState {
    proposals: ProposalState;
    voting: VotingState;
}

export const daoReducer = combineReducers({
    proposals: proposalReducer,
    voting: votingReducer,
});

export default daoReducer;