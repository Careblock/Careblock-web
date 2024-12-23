export interface Results {
    id: string;
    appointmentId: string;
    diagnosticUrl: string;
    message?: string;
    createdDate: string;
    modifiedDate: string;
}

export interface Bill {
    patientName: any;
    gender: any;
    phone: any;
    address: any;
    doctorName: any;
    departmentName: any;
    organizationName: any;
    examinationPackageName: any;
    examinationOptions: any;
    totalPrice: any;
    createdDate: any;
}
