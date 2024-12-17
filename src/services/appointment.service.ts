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

    public updateStatus(status: APPOINTMENT_STATUS, id: string) {
        return HttpService.get<boolean>(`/appointment/update-status/${status}/${id}`);
    }
}

const AppointmentService = new _AppointmentService();

export default AppointmentService;
