import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { CreateConsultationType, DiagnosticsFieldType } from './create-consultation.type';
import { selectDiagnosticOptions, vitalsDynamicField } from './create-consultation.const';
import BaseSelectBox from '@/components/base/select-box/select-box.component';
import { addToast } from '@/components/base/toast/toast.service';
import DiagnosticService from '@/services/diagnostic.service';
import { DIAGNOSTIC_STATUS, DataType } from '@/enums/Common';
import { SystemMessage } from '@/constants/message.const';
import useObservable from '@/hooks/use-observable.hook';
import { Diagnostics } from '@/types/diagnostics.type';
import { AuthContextType } from '@/types/auth.type';
import { useAuth } from '@/contexts/auth.context';
import { Images } from '@/assets/images';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const mockData = [
    {
        id: '1',
        value: 'Khám bệnh',
    },
    {
        id: '2',
        value: 'Khám mắt',
    },
    {
        id: '3',
        value: 'Khám răng',
    },
];

export default function CreateConsultation({ visible, setVisible, patientId, clickedSave }: CreateConsultationType) {
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [isShowVitals, setIsShowVitals] = useState(false);
    const [isShowAttachments, setIsShowAttachments] = useState(false);
    const [diagnostics, setDiagnostics] = useState<Diagnostics>(getInitialValue());
    const [file, setFile] = useState<File | null>(null);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    function getInitialValue(): Diagnostics {
        return {
            doctorId: userData?.id,
            patientId: patientId,
            id: '',
            bodyTemperature: 0,
            diastolicBloodPressure: 0,
            disease: '',
            heartRate: 0,
            height: 0,
            note: '',
            systolicBloodPressure: 0,
            weight: 0,
            status: DIAGNOSTIC_STATUS.NORMAL,
        };
    }

    const handleClose = () => {
        setVisible(false);
        setDiagnostics(getInitialValue());
        setIsShowVitals(false);
        setIsShowAttachments(false);
    };

    const handleClickSave = () => {
        subscribeOnce(DiagnosticService.insert(diagnostics), (_: string) => {
            addToast({ text: SystemMessage.INSERT_DIAGNOSTIC_SUCCESS, position: 'top-right' });
            clickedSave();
        });
        handleClose();
    };

    const handleToggleVitals = () => {
        setIsShowVitals(!isShowVitals);
    };

    const handleToggleAttachments = () => {
        setIsShowAttachments(!isShowAttachments);
    };

    const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) setFile(e.target.files[0]);
    };

    const handleChangeValue = (field: DiagnosticsFieldType, value: string, dataType: DataType) => {
        let newValue = { ...diagnostics };
        if (dataType === DataType.number && !Number.isNaN(+value)) {
            newValue = { ...newValue, [field]: +value };
        } else if (dataType === DataType.string) {
            newValue = { ...newValue, [field]: value };
        }
        setDiagnostics(newValue);
    };

    return (
        <StyledDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={visible}>
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
            <DialogContent dividers className="w-[600px]">
                <TextField
                    id="note-field"
                    className="w-full !mb-5"
                    label="Note"
                    multiline
                    rows={3}
                    value={diagnostics.note}
                    onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                        handleChangeValue('note', event.target.value, DataType.string)
                    }
                />
                {/* <PeopleSelect
                  width="100%"
                  className="!mb-5"
                  id="consultation-select-doctor"
                  label='Doctor
                  placeholder='Choose a doctor'
                  isMultiple={false}
                /> */}
                <BaseSelectBox
                    id="bill-select"
                    modelValue=""
                    updateModelValue={() => {}}
                    inputId="input-bill-select"
                    label="Bill"
                    dataSource={mockData}
                />
                <div className="vitals my-5">
                    <div className="flex items-center space-x-3 mb-5">
                        <div className="">Vitals</div>
                        {!isShowVitals ? (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleToggleVitals}
                                startIcon={<Images.AddIcon />}
                            >
                                Add
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleToggleVitals}
                                startIcon={<Images.RemoveIcon />}
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                    {isShowVitals && (
                        <div className="flex items-center gap-x-3 gap-y-4 flex-wrap w-full !mb-5">
                            {vitalsDynamicField.map((field) => (
                                <div className={field.className} key={field.id}>
                                    <TextField
                                        id={field.id}
                                        className="w-full"
                                        label={field.label}
                                        value={diagnostics[field.field]}
                                        onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                            handleChangeValue(field.field, event.target.value, field.dataType)
                                        }
                                    />
                                </div>
                            ))}
                            <div className="w-[48%]">
                                <BaseSelectBox
                                    id="status-select"
                                    modelValue={`${diagnostics.status}`}
                                    updateModelValue={(newValue: number) =>
                                        handleChangeValue('status', `${newValue}`, DataType.number)
                                    }
                                    inputId="input-status-select"
                                    label="Status"
                                    dataSource={selectDiagnosticOptions}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="attachments mt-5">
                    <div className="flex items-center space-x-3 mb-5">
                        <div className="">Attachments</div>
                        {!isShowAttachments ? (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleToggleAttachments}
                                startIcon={<Images.AddIcon />}
                            >
                                Add
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleToggleAttachments}
                                startIcon={<Images.RemoveIcon />}
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                    {isShowAttachments && (
                        <div className="space-y-4">
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload file
                                <VisuallyHiddenInput type="file" onChange={handleUploadFile} />
                            </Button>
                            <TextField
                                label="File Name"
                                value={file?.name ?? ''}
                                variant="filled"
                                className="w-full"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </div>
                    )}
                </div>
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
