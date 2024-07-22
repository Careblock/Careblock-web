import { APPOINTMENT_STATUS } from '@/enums/Appointment';
import HttpService from './http/http.service';
import { Accounts } from '@/types/account.type';
import { Patients } from '@/types/patient.type';

class _AccountService {
    public getById(id: string) {
        return HttpService.get<Accounts>(`/Account/${id}`);
    }

    public filterByOrganization(organizationID: string) {
        return HttpService.get<Accounts[]>(`/account/filter-by-organization/${organizationID}`);
    }

    public getScheduledPatient(doctorID: string, status: APPOINTMENT_STATUS) {
        return HttpService.get<Patients[]>(`/account/get-scheduled-patient/${status}/${doctorID}`);
    }

    // public testAnonymus() {
    //   return HttpService.get<Accounts>(`/Account/test-anonymus`);
    // }

    // public testAllRoles() {
    //   return HttpService.get<Accounts>(`/Account/test-all-roles`);
    // }

    // public testDoctorandPatient() {
    //   return HttpService.get<Accounts>(`/Account/test-doctor-and-patient`);
    // }

    // public testAdmin() {
    //   return HttpService.get<Accounts>(`/Account/test-admin`);
    // }
}

const AccountService = new _AccountService();

export default AccountService;
