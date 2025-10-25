import { Environment } from '@/environment';
import { Observable } from 'rxjs';

export interface VotingApiResponse {
    votings: VotingItem[];
    totalCount: number;
}

export interface VotingItem {
    id: string;
    title: string;
    problemSummary: string;
    problemDetail: string;
    solution: string;
    endDate: string;
    transactionId?: string;
    ownerStakeId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface VotingChoice {
    id: string;
    votingId: string;
    choice: number;
    metadata: string;
    createdAt: string;
    transactionId: string;
    ownerStakeId: string;
}

export interface VotingDetailResponse {
    id: string;
    title: string;
    problemSummary: string;
    problemDetail: string;
    solution: string;
    endDate: string;
    transactionId?: string;
    ownerStakeId?: string;
    createAt: string;
    updateAt: string;
    votingChoices: VotingChoice[];
    totalChoice: number;
    yesCount: number;
    noCount: number;
    abstainCount: number;
}

export interface VotingApiParams {
    isActive?: boolean;
    pageIndex?: number;
    pageSize?: number;
}

export interface VoteSubmissionRequest {
    choice: number; // 1: Yes, 2: No, 3: Abstain
    metadata: string;
    transactionId: string;
    ownerStakeId: string;
}

export interface VoteSubmissionResponse {
    success: boolean;
}

export interface CreateProposalRequest {
    title: string;
    problemSummary: string;
    problemDetail: string;
    solution: string;
    transactionId: string;
    ownerStakeId: string;
}

export interface CreateProposalResponse {
    proposalId: string;
}

export interface ValidateVoterRequest {
    votingId: string;
    stakeId: string;
}

export interface ValidateVoterResponse {
    canVote: boolean;
}

class _VotingApiService {
    private baseUrl = Environment.BASE_API;

    getAllVotings(params?: VotingApiParams): Observable<VotingApiResponse> {
        const queryParams = new URLSearchParams();
        
        if (params) {
            if (typeof params.isActive === 'boolean') {
                queryParams.append('isActive', params.isActive.toString());
            }
            if (params.pageIndex !== undefined) {
                queryParams.append('pageIndex', params.pageIndex.toString());
            }
            if (params.pageSize !== undefined) {
                queryParams.append('pageSize', params.pageSize.toString());
            }
        }

        const url = `${this.baseUrl}/Voting?${queryParams.toString()}`;
        console.log('Calling API URL:', url);

        // Use fetch directly to avoid HttpService complications
        return new Observable<VotingApiResponse>((observer) => {
            fetch(url)
                .then(response => {
                    console.log('Fetch response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Raw API data:', data);
                    
                    // Validate and return data
                    if (data && data.votings && Array.isArray(data.votings)) {
                        observer.next(data as VotingApiResponse);
                    } else {
                        console.error('Invalid data structure:', data);
                        observer.next({
                            votings: [],
                            totalCount: 0
                        });
                    }
                    observer.complete();
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    observer.error(error);
                });
        });
    }

    getActiveVotings(): Observable<VotingApiResponse> {
        return this.getAllVotings({ isActive: true, pageIndex: 1, pageSize: 20 });
    }

    getAllVotingsWithPagination(pageIndex: number = 1, pageSize: number = 20): Observable<VotingApiResponse> {
        return this.getAllVotings({ pageIndex, pageSize });
    }

    getAllInactiveVotings(pageIndex: number = 1, pageSize: number = 20): Observable<VotingApiResponse> {
        return this.getAllVotings({ isActive: false, pageIndex, pageSize });
    }

    getVotingDetail(votingId: string): Observable<VotingDetailResponse> {
        const url = `${this.baseUrl}/Voting/${votingId}`;
        console.log('Calling Voting Detail API URL:', url);

        return new Observable<VotingDetailResponse>((observer) => {
            fetch(url)
                .then(response => {
                    console.log('Fetch voting detail response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Raw voting detail data:', data);
                    observer.next(data as VotingDetailResponse);
                    observer.complete();
                })
                .catch(error => {
                    console.error('Fetch voting detail error:', error);
                    observer.error(error);
                });
        });
    }

    submitVote(votingId: string, voteRequest: VoteSubmissionRequest): Observable<VoteSubmissionResponse> {
        const url = `${this.baseUrl}/Voting/${votingId}/choices`;
        console.log('Calling Vote Submission API URL:', url);
        console.log('Vote Request:', voteRequest);

        return new Observable<VoteSubmissionResponse>((observer) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(voteRequest)
            })
                .then(response => {
                    console.log('Vote submission response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Vote submission response data:', data);
                    // API returns true/false, we map it to our interface
                    observer.next({ success: data === true });
                    observer.complete();
                })
                .catch(error => {
                    console.error('Vote submission error:', error);
                    observer.error(error);
                });
        });
    }

    createProposal(proposalRequest: CreateProposalRequest): Observable<CreateProposalResponse> {
        const url = `${this.baseUrl}/Voting`;
        console.log('Calling Create Proposal API URL:', url);
        console.log('Proposal Request:', proposalRequest);

        return new Observable<CreateProposalResponse>((observer) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(proposalRequest)
            })
                .then(response => {
                    console.log('Create proposal response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Create proposal response data:', data);
                    // API returns proposal ID as string
                    observer.next({ proposalId: data });
                    observer.complete();
                })
                .catch(error => {
                    console.error('Create proposal error:', error);
                    observer.error(error);
                });
        });
    }

    validateVoter(votingId: string, stakeId: string): Observable<ValidateVoterResponse> {
        const queryParams = new URLSearchParams();
        queryParams.append('votingId', votingId);
        queryParams.append('stakeId', stakeId);
        
        const url = `${this.baseUrl}/Voting/validate-voter?${queryParams.toString()}`;
        console.log('Calling Validate Voter API URL:', url);

        return new Observable<ValidateVoterResponse>((observer) => {
            fetch(url, {
                method: 'GET',
                headers: {
                    'accept': '*/*',
                }
            })
                .then(response => {
                    console.log('Validate voter response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Validate voter response data:', data);
                    // API returns true/false, we map it to our interface
                    observer.next({ canVote: data === true });
                    observer.complete();
                })
                .catch(error => {
                    console.error('Validate voter error:', error);
                    observer.error(error);
                });
        });
    }
}

const VotingApiService = new _VotingApiService();
export default VotingApiService;