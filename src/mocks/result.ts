import { GENDER } from '@/enums/Common';

export const resultData = JSON.stringify({
    general: {
        fullname: 'Hiep Nguyen Ngoc',
        dateOfBirth: '05/08/2002',
        order: 1,
        gender: GENDER.MALE,
        title: 'Kết quả khám sức khỏe định kỳ và tư vấn điều trị dành cho cá nhân công ty TNHH Grapecity',
        createdDate: '16/06/2024',
        hospital: 'Bệnh viện đa khoa tư nhân Hà Thành',
    },
    clinicalExamination: {
        height: 172,
        weight: 68,
        bmi: 23,
        circuit: 69,
        bloodPressure: '120/70',
        generality: 'Normal',
        vision: {
            right: {
                old: 10,
                new: 2,
            },
            left: {
                old: 10,
                new: 8,
            },
        },
        eyes: 'Both eyes have refractive errors',
        tmh: 'Chronic pharyngitis',
        dentomaxillofacial: 'Grade II tartar',
        dermatology: 'Normal',
        obstetricExamination: '',
    },
    paraclinicalResults: {
        test: {
            glucose: 5.08,
            kidney: {
                ure: 4.81,
                creatinin: 85.47,
            },
            acidUric: 475.1,
            liver: {
                ast: 28.42,
                alt: 36.11,
                ggt: 34.61,
            },
            cholesterol: {
                triglycerid: 0.93,
                cholesterol: 3.51,
                hdl: 1.32,
                ldl: 1.77,
            },
            ca724: '<0.5',
            peripheralBloodCells: {
                whiteBloodCells: 5.68,
                redBloodCells: 5.41,
                hst: 155,
                platelet: 191,
            },
            urine: {
                glucose: -1,
                redBloodCells: -1,
                protein: -1,
                whiteBloodCells: -1,
            },
            cea: 1.57,
            afp: 1.63,
            ca125: 0,
        },
        xQuang: 'Currently, chest x-ray images show no abnormalities',
        abdominalUltrasound: 'Normal',
        mammaryGland: '',
        thyroid: 'Tirads left lobe thyroid cyst 2',
    },
    note: 'Pathology that needs consultation and treatment: Refractive errors require wearing glasses of the correct number. Sore throat: limit eating and drinking cold foods. Gargle regularly with light salt water. Thyroid cysts are monitored and checked periodically. Dental plaque needs to be removed periodically every 6 months.',
    healthClassification: 2,
});
