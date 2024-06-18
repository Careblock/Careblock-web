import { setTitle } from '@/utils/document';
import { useEffect } from 'react';

const PatientPage = () => {
    useEffect(() => {
        setTitle('Patient | CareBlock');
    }, []);

    return <>Patient</>;
};

export default PatientPage;
