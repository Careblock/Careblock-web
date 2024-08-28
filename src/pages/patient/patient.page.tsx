import { addToast } from '@/components/base/toast/toast.service';
import TestResult from '@/components/others/test-result/test-result.component';
import { SystemMessage } from '@/constants/message.const';
import { StatusCode } from '@/enums/StatusCode';
import useObservable from '@/hooks/use-observable.hook';
import ExaminationResultService from '@/services/examinationResult.service';
import { Template_Result_1 } from '@/types/template.type';
import { resolveUri } from '@/utils/common.helpers';
import { Button } from '@mui/material';
import ReactPDF from '@react-pdf/renderer';
import { useState } from 'react';

const PatientPage = () => {
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const { subscribeOnce } = useObservable();

    const onUploadFile = (props: ReactPDF.OnRenderProps, dataSource: Template_Result_1) => {
        if (props?.blob && isFirstLoad) {
            const pdfFile = new File([props.blob], `examination-result-${'c2d299de-2f73-4297-8ba1-cd132632839a'}.pdf`, {
                type: 'application/pdf',
            });
            // TODO: Update api insert a result
            // subscribeOnce(
            //     ExaminationResultService.insert({
            //         resultFile: pdfFile,
            //         key: 'nnhiep',
            //         patientId: 'c2d299de-2f73-4297-8ba1-cd132632839a',
            //         value: JSON.stringify(dataSource),
            //     }),
            //     (res: string) => {
            //         if (res) {
            //             addToast({ text: SystemMessage.UPLOAD_RESULT, position: 'top-right' });
            //         }
            //     }
            // );
            setIsFirstLoad(false);
        }
    };

    const onClickGetFile = async () => {
        const response = await fetch(
            resolveUri('/ExaminationResult/get-file-by-patient/c2d299de-2f73-4297-8ba1-cd132632839a')
        );
        if (response.status === StatusCode.Success) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            window.open(url);
        } else addToast({ text: SystemMessage.UNKNOWN_ERROR, position: 'top-right' });
    };

    return (
        <>
            {/* <Button variant="contained" onClick={() => onClickGetFile()}>
                Get file
            </Button>
            <TestResult onUploadFile={onUploadFile} /> */}
            <p>Dashboard</p>
        </>
    );
};

export default PatientPage;
