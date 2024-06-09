import { Diagnostics } from '@/types/diagnostics.type';
import HttpService from './http/http.service';

class _DiagnosticService {
    public insert(diagnostic: Diagnostics) {
        return HttpService.post<string>(`/Diagnostic/create`, { body: { ...diagnostic } });
    }
}

const DiagnosticService = new _DiagnosticService();

export default DiagnosticService;
