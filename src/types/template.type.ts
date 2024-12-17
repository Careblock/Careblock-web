export interface Template_Result_1 {
    general: {
        fullname?: string;
        dateOfBirth?: string;
        order?: number;
        gender?: number;
        title?: string;
        createdDate?: string;
        hospital?: string;
        sign?: string;
    };
    clinicalExamination: {
        height?: number;
        weight?: number;
        bmi?: number;
        circuit?: number;
        bloodPressure?: string;
        generality?: string;
        vision: {
            right: {
                old?: number;
                new?: number;
            };
            left: {
                old?: number;
                new?: number;
            };
        };
        eyes?: string;
        tmh?: string;
        dentomaxillofacial?: string;
        dermatology?: string;
        obstetricExamination?: string;
    };
    paraclinicalResults: {
        test: {
            glucose?: number;
            kidney: {
                ure?: number;
                creatinin?: number;
            };
            acidUric?: number;
            liver: {
                ast?: number;
                alt?: number;
                ggt?: number;
            };
            cholesterol: {
                triglycerid?: number;
                cholesterol?: number;
                hdl?: number;
                ldl?: number;
            };
            ca724?: string;
            peripheralBloodCells: {
                whiteBloodCells?: number;
                redBloodCells?: number;
                hst?: number;
                platelet?: number;
            };
            urine: {
                glucose?: number;
                redBloodCells?: number;
                protein?: number;
                whiteBloodCells?: number;
            };
            cea?: number;
            afp?: number;
            ca125?: number;
        };
        xQuang?: string;
        abdominalUltrasound?: string;
        mammaryGland?: string;
        thyroid?: string;
    };
    note?: string;
    healthClassification?: number;
}
