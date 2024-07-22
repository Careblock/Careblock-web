import { APPOINTMENT_STATUS } from '@/enums/Appointment';
import HttpService from './http/http.service';
import { Appointments } from '@/types/appointment.type';

class _AppointmentService {
    public getAll() {
        return HttpService.get<Appointments[]>(`/appointment`);
    }

    public insert(appointment: Appointments) {
        return HttpService.post<any>(`/appointment/create`, { body: { ...appointment } });
    }

    public appointment_history_by_id(patientId: string) {
        return HttpService.get<any>(`/Appointment/get-by-patient/${patientId}`);
    }

    public updateStatus(status: APPOINTMENT_STATUS, id: string) {
        return HttpService.get<boolean>(`/appointment/update-status/${status}/${id}`);
    }
}

const AppointmentService = new _AppointmentService();

export default AppointmentService;
