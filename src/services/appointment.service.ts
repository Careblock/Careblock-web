import { APPOINTMENT_STATUS } from '@/enums/Appointment';
import HttpService from './http/http.service';
import { Appointments } from '@/types/appointment.type';
import { AppointmentRequest } from '@/types/appointmentRequest.type';
import { PagingResponse } from '@/types/pagingResponse.type';

class _AppointmentService {
    public getAll() {
        return HttpService.get<Appointments[]>(`/appointment`);
    }

    public getById(id: string) {
        return HttpService.get<Appointments>(`/appointment/${id}`);
    }

    public getAppointmentHistories(patientId: string) {
        return HttpService.get<any>(`/appointment/get-by-patient/${patientId}`);
    }

    public getNumberNotAssigned(userId: string) {
        return HttpService.get<number>(`/appointment/not-assigned/${userId}`);
    }

    public getOrgAppointmentHistories(appointmentRequest: AppointmentRequest) {
        return HttpService.post<PagingResponse>(`/appointment/get-by-organization`, {
            body: { ...appointmentRequest },
        });
    }

    public insert(appointment: Appointments) {
        return HttpService.post<any>(`/appointment/create`, {
            body: { ...appointment },
        });
    }

    public assignDoctor(appointmentId: string, doctorId: string) {
        return HttpService.post<number>(`/appointment/assign-doctor/${appointmentId}`, {
            body: {
                doctorId,
            },
        });
    }

    public updateStatus(status: APPOINTMENT_STATUS, id: string) {
        return HttpService.get<boolean>(`/appointment/update-status/${status}/${id}`);
    }
}

const AppointmentService = new _AppointmentService();

export default AppointmentService;
