import { 
    Vote, 
    VoteRequest, 
    Voter,
    DelegationRequest,
    GovernanceActivity 
} from '@/types/daoVoting.type';
import { Observable } from 'rxjs';
import HttpService from './http/http.service';

class _VotingService {

    castVote(voteRequest: VoteRequest): Observable<Vote> {
        return HttpService.post<Vote>('/dao/votes', { 
            body: voteRequest 
        });
    }

    getVotesByProposal(proposalId: string): Observable<Vote[]> {
        return HttpService.get<Vote[]>(`/dao/proposals/${proposalId}/votes`);
    }

    getVotesByVoter(voterId: string): Observable<Vote[]> {
        return HttpService.get<Vote[]>(`/dao/voters/${voterId}/votes`);
    }

    getVoterInfo(voterId: string): Observable<Voter> {
        return HttpService.get<Voter>(`/dao/voters/${voterId}`);
    }

    updateVoterProfile(voterId: string, updates: Partial<Voter>): Observable<Voter> {
        return HttpService.put<Voter>(`/dao/voters/${voterId}`, { 
            body: updates 
        });
    }

    delegateVotingPower(delegationRequest: DelegationRequest): Observable<void> {
        return HttpService.post<void>('/dao/delegations', { 
            body: delegationRequest 
        });
    }

    revokeDelegation(voterId: string): Observable<void> {
        return HttpService.delete<void>(`/dao/delegations/${voterId}`);
    }

    getGovernanceActivity(limit?: number): Observable<GovernanceActivity[]> {
        const queryParams: any = {};
        if (limit) {
            queryParams.limit = limit.toString();
        }
        
        return HttpService.get<GovernanceActivity[]>('/dao/activity', { queryParams });
    }

    getVotingHistory(voterId: string, limit?: number): Observable<Vote[]> {
        const queryParams: any = {};
        if (limit) {
            queryParams.limit = limit.toString();
        }
        
        return HttpService.get<Vote[]>(`/dao/voters/${voterId}/history`, { queryParams });
    }

    checkVotingEligibility(proposalId: string, voterId: string): Observable<{ eligible: boolean; reason?: string }> {
        return HttpService.get<{ eligible: boolean; reason?: string }>(
            `/dao/proposals/${proposalId}/eligibility/${voterId}`
        );
    }
}

const VotingService = new _VotingService();
export default VotingService;