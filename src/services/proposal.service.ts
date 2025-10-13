import { 
    Proposal, 
    CreateProposalRequest, 
    GovernanceStats, 
    ProposalFilter,
    GovernanceMetrics,
    ProposalDocument 
} from '@/types/daoVoting.type';
import { Observable } from 'rxjs';
import HttpService from './http/http.service';
import { RequestContentType } from './http/http.type';

class _ProposalService {

    getAllProposals(filter?: ProposalFilter): Observable<Proposal[]> {
        const queryParams: any = {};
        
        if (filter) {
            if (filter.status?.length) {
                queryParams.status = filter.status.join(',');
            }
            if (filter.type?.length) {
                queryParams.type = filter.type.join(',');
            }
            if (filter.category?.length) {
                queryParams.category = filter.category.join(',');
            }
            if (filter.createdBy) {
                queryParams.createdBy = filter.createdBy;
            }
            if (filter.dateFrom) {
                queryParams.dateFrom = filter.dateFrom.toISOString();
            }
            if (filter.dateTo) {
                queryParams.dateTo = filter.dateTo.toISOString();
            }
            if (filter.sortBy) {
                queryParams.sortBy = filter.sortBy;
            }
            if (filter.sortOrder) {
                queryParams.sortOrder = filter.sortOrder;
            }
        }

        return HttpService.get<Proposal[]>('/dao/proposals', { queryParams });
    }

    getProposalById(id: string): Observable<Proposal> {
        return HttpService.get<Proposal>(`/dao/proposals/${id}`);
    }

    createProposal(proposal: CreateProposalRequest): Observable<Proposal> {
        const body: any = {
            title: proposal.title,
            description: proposal.description,
            type: proposal.type,
            category: proposal.category,
            rationale: proposal.rationale,
            votingDuration: proposal.votingDuration,
        };

        if (proposal.impact) {
            body.impact = proposal.impact;
        }
        if (proposal.implementation) {
            body.implementation = proposal.implementation;
        }

        if (proposal.documents?.length) {
            return HttpService.post<Proposal>('/dao/proposals', {
                body,
                requestContentType: RequestContentType.MULTIPART,
            });
        }

        return HttpService.post<Proposal>('/dao/proposals', { body });
    }

    updateProposal(id: string, proposal: Partial<CreateProposalRequest>): Observable<Proposal> {
        return HttpService.put<Proposal>(`/dao/proposals/${id}`, { body: proposal });
    }

    deleteProposal(id: string): Observable<void> {
        return HttpService.delete<void>(`/dao/proposals/${id}`);
    }

    getGovernanceStats(): Observable<GovernanceStats> {
        return HttpService.get<GovernanceStats>('/dao/governance/stats');
    }

    getGovernanceMetrics(): Observable<GovernanceMetrics> {
        return HttpService.get<GovernanceMetrics>('/dao/governance/metrics');
    }

    uploadProposalDocument(proposalId: string, file: File): Observable<ProposalDocument> {
        return HttpService.post<ProposalDocument>(`/dao/proposals/${proposalId}/documents`, {
            body: { document: file },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    deleteProposalDocument(proposalId: string, documentId: string): Observable<void> {
        return HttpService.delete<void>(`/dao/proposals/${proposalId}/documents/${documentId}`);
    }
}

const ProposalService = new _ProposalService();
export default ProposalService;