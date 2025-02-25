import { ExaminationPackageReview } from '@/types/examinationPackageReview.type';
import HttpService from './http/http.service';

class _ExaminationPackageReviewService {
   
    private BASE_URL: string = "/ExaminationPackageReview"

    public create(result: ExaminationPackageReview) {
        return HttpService.post<string>(this.BASE_URL + `/create`, {
            body: { ...result },
        });
    }

    public update(id: string, feedback: ExaminationPackageReview) {
        return HttpService.put<string>(this.BASE_URL + `/${id}`, {
            body: { ...feedback },
        });
    }

    public getByAppointmentID(appointmentId: string) {
        return HttpService.get<ExaminationPackageReview>(this.BASE_URL + `/appointment/${appointmentId}`);
    }

    public delete(id: string) {
        return HttpService.delete<string>(this.BASE_URL + `/${id}`);
    }
}

const ExaminationPackageReviewService = new _ExaminationPackageReviewService();

export default ExaminationPackageReviewService;
