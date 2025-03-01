import { APPOINTMENT_STATUS } from '@/enums/Appointment';
import HttpService from './http/http.service';
import { Accounts } from '@/types/account.type';
import { Patients } from '@/types/patient.type';
import { AccountRequest } from '@/types/accountRequest.type';
import { RequestContentType } from './http/http.type';
import { User } from '@/types/auth.type';
import { DataDefaults } from '@/types/dataDefault.type';
import { Doctors } from '@/types/doctor.type';
import { Place } from '@/enums/Place';
import { ChooseDepartment } from '@/types/chooseDepartment.type';

class _AccountService {
    public getById(id: string) {
        return HttpService.get<Accounts>(`/Account/${id}`);
    }

    public getScheduledPatient(doctorID: string, status: APPOINTMENT_STATUS) {
        return HttpService.get<Patients[]>(`/account/get-scheduled-patient/${status}/${doctorID}`);
    }

    public getDefaultData(appointmentId: string) {
        return HttpService.get<DataDefaults>(`/account/get-default-data/${appointmentId}`);
    }

    public getAllDoctor() {
        return HttpService.get<Doctors[]>(`/account/get-all-doctor`);
    }

    public getDoctorsOrg(place: Place, doctorId: string) {
        return HttpService.get<Doctors[]>(`/account/get-doctors-org/${place}/${doctorId}`);
    }

    public getManagersOrg(organizationId: string) {
        return HttpService.get<Doctors[]>(`/account/get-managers-org/${organizationId}`);
    }

    public removeDoctorFromOrg(doctorId: string) {
        return HttpService.post<boolean>(`/account/remove-doctors-org/${doctorId}`);
    }

    public grantPermission(userId: string, permissions: string[]) {
        return HttpService.post<boolean>(`/account/grant-permission/${userId}`, {
            body: {
                permissions,
            },
        });
    }

    public grantSignPermission(targetId: string, originId?: string) {
        return HttpService.post<boolean>(`/account/grant-sign-permission`, {
            body: {
                targetId,
                originId: originId,
            },
        });
    }

    public chooseDepartment(userId: string, request: ChooseDepartment) {
        return HttpService.post<boolean>(`/account/choose-department/${userId}`, {
            body: {
                ...request,
            },
        });
    }

    public update(id: string, account: AccountRequest) {
        return HttpService.put<User>(`/account/${id}`, {
            body: { ...account },
            requestContentType: RequestContentType.MULTIPART,
        });
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
