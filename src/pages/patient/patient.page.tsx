const PatientPage = () => {
    // const [isFirstLoad, setIsFirstLoad] = useState(true);

    // const onUploadFile = (props: ReactPDF.OnRenderProps, dataSource: Template_Result_1) => {
    //     if (props?.blob && isFirstLoad) {
    //         const pdfFile = new File([props.blob], `examination-result-${'c2d299de-2f73-4297-8ba1-cd132632839a'}.pdf`, {
    //             type: 'application/pdf',
    //         });
    //         // TODO: Update api insert a result
    //         // subscribeOnce(
    //         //     ExaminationResultService.insert({
    //         //         resultFile: pdfFile,
    //         //         key: 'nnhiep',
    //         //         patientId: 'c2d299de-2f73-4297-8ba1-cd132632839a',
    //         //         value: JSON.stringify(dataSource),
    //         //     }),
    //         //     (res: string) => {
    //         //         if (res) {
    //         //             addToast({ text: SystemMessage.UPLOAD_RESULT, position: 'top-right' });
    //         //         }
    //         //     }
    //         // );
    //         setIsFirstLoad(false);
    //     }
    // };

    // const onClickGetFile = async () => {
    //     const response = await fetch(
    //         resolveUri('/ExaminationResult/get-file-by-patient/c2d299de-2f73-4297-8ba1-cd132632839a')
    //     );
    //     if (response.status === StatusCode.Success) {
    //         const blob = await response.blob();
    //         const url = URL.createObjectURL(blob);
    //         window.open(url);
    //     } else addToast({ text: SystemMessage.UNKNOWN_ERROR, position: 'top-right' });
    // };

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
