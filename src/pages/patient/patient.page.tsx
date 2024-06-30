import { addToast } from '@/components/base/toast/toast.service';
import TestResult from '@/components/others/test-result/test-result.component';
import { SystemMessage } from '@/constants/message.const';
import { StatusCode } from '@/enums/StatusCode';
import useObservable from '@/hooks/use-observable.hook';
import ExaminationResultService from '@/services/examinationResult.service';
import { ResultType } from '@/types/result.type';
import { resolveUri } from '@/utils/common.helpers';
import { Button } from '@mui/material';
import ReactPDF from '@react-pdf/renderer';

const PatientPage = () => {
    const { subscribeOnce } = useObservable();

    const onUploadFile = (props: ReactPDF.OnRenderProps, dataSource: ResultType) => {
        if (props?.blob) {
            const pdfFile = new File([props.blob], `examination-result-${'c2d299de-2f73-4297-8ba1-cd132632839a'}.pdf`, {
                type: 'application/pdf',
            });
            subscribeOnce(
                ExaminationResultService.insert({
                    resultFile: pdfFile,
                    key: 'nnhiep',
                    patientId: 'c2d299de-2f73-4297-8ba1-cd132632839a',
                    value: JSON.stringify(dataSource),
                }),
                (res: string) => {
                    if (res) {
                        addToast({ text: SystemMessage.UPLOAD_RESULT, position: 'top-right' });
                    }
                }
            );
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
            <Button variant="contained" onClick={() => onClickGetFile()}>
                Get file
            </Button>
            <TestResult onUploadFile={onUploadFile} />
        </>
    );
};

export default PatientPage;
