import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { CreateConsultationType } from './create-consultation.type';
import { addToast } from '@/components/base/toast/toast.service';
import AppointmentDetailService from '@/services/appointmentDetail.service';
import { SystemMessage } from '@/constants/message.const';
import useObservable from '@/hooks/use-observable.hook';
import { useAuth } from '@/contexts/auth.context';
import { Images } from '@/assets/images';
import DynamicResult from '@/components/others/dynamic-result/dynamic-result.component';
import { FormType } from '@/enums/FormType';
import { dynamicFieldData } from '@/mocks/dynamic-field';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { useEffect, useState } from 'react';
import { DynamicFieldType } from '@/types/dynamic-field.type';
import AccountService from '@/services/account.service';
import { DataDefaults } from '@/types/dataDefault.type';
import { cloneDeep } from 'lodash';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function CreateConsultation({
    visible,
    setVisible,
    patientId,
    clickedSave,
    appointmentId,
}: CreateConsultationType) {
    const { subscribeOnce } = useObservable();
    const [dataSource, setDataSource] = useState<DynamicFieldType[]>(getInitialData());

    useEffect(() => {
        subscribeOnce(AccountService.getDefaultData(appointmentId), (res: DataDefaults) => {
            let temp = cloneDeep(dataSource);
            temp[0].images = [res.organizationThumbnail ?? ''];
            temp[1].value = res.organizationName;
            temp[2].value = res.organizationAddress;
            temp[3].value = res.organizationTel;
            temp[4].value = res.organizationTel;
            temp[5].value = res.organizationUrl;
            temp[8].value = res.fullName;
            temp[9].value = res.dateOfBirth ?? '';
            temp[10].value = res.gender;
            temp[11].value = res.address;
            temp[21].value = Date.now();
            temp[23].value = res.doctorId;
            temp[23].displayValue = res.doctorName;
            temp[24].value = res.doctorId;
            temp[24].displayValue = res.doctorName;

            setDataSource(temp);
        });
    }, []);

    function getInitialData() {
        return cloneDeep(dynamicFieldData);
    }

    const handleClose = () => {
        setVisible(false);
    };

    const handleClickSave = () => {
        // subscribeOnce(AppointmentDetailService.insert(diagnostics), (_: string) => {
        //     addToast({ text: SystemMessage.INSERT_DIAGNOSTIC_SUCCESS, position: 'top-right' });
        clickedSave();
        // });
        handleClose();
    };

    const onClickConvertToImage = (dynamicRef: any) => {
        toPng(dynamicRef.current)
            .then(function (dataUrl: any) {
                let img = new Image();
                img.src = dataUrl;

                const doc = new jsPDF();
                const imgProps = doc.getImageProperties(img);
                const pdfWidth = (doc.internal.pageSize.getWidth() * 90) / 100;
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                const pdfX = (doc.internal.pageSize.getWidth() - pdfWidth) / 2;

                doc.addImage(img, 'PNG', pdfX, 20, pdfWidth, pdfHeight);
                doc.save('result.pdf');
            })
            .catch(function (error: any) {
                console.error('Oops, something went wrong!', error);
            });
    };

    return (
        <StyledDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={visible} maxWidth="lg">
            {/* Header */}
            <DialogTitle className="text-[20px]" sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Create Consultation Request
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <Images.CloseIcon className="text-[24px]" />
            </IconButton>

            {/* Content */}
            <DialogContent dividers>
                <DynamicResult
                    type={FormType.Detail}
                    datasource={dataSource}
                    onClickConvertToImage={onClickConvertToImage}
                />
            </DialogContent>

            {/* Footer */}
            <DialogActions>
                <Button variant="contained" autoFocus onClick={handleClickSave}>
                    Create
                </Button>
                <Button variant="text" color="error" autoFocus onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </StyledDialog>
    );
}
