import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { CreateConsultationType } from './create-consultation.type';
import useObservable from '@/hooks/use-observable.hook';
import { Images } from '@/assets/images';
import DynamicResult from '@/components/others/dynamic-result/dynamic-result.component';
import { FormType } from '@/enums/FormType';
import { dynamicFieldData } from '@/mocks/dynamic-field';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { useEffect, useState, useRef } from 'react';
import { DynamicFieldType } from '@/types/dynamic-field.type';
import AccountService from '@/services/account.service';
import { DataDefaults } from '@/types/dataDefault.type';
import { cloneDeep } from 'lodash';
import { DynamicField } from '@/enums/DynamicField';
import { addToast } from '@/components/base/toast/toast.service';
import { SystemMessage } from '@/constants/message.const';
import AppointmentDetailService from '@/services/appointmentDetail.service';
import { Appointments } from '@/types/appointment.type';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ExaminationOptions } from '@/types/examinationOption.type';
import ExaminationOptionService from '@/services/examinationOption.service';
import { EMPTY_GUID } from '@/constants/common.const';
import { ToastPositionEnum, ToastStatusEnum } from '@/components/base/toast/toast.type';
import { Environment } from '@/environment';
import { useAuth } from '@/contexts/auth.context';
import { AuthContextType } from '@/types/auth.type';
import { AssetMetadata, BrowserWallet, ForgeScript, Mint, Transaction } from '@meshsdk/core';
import { uuidv4 } from '@/utils/common.helpers';
import { formatDateToString } from '@/utils/datetime.helper';
import Loading from '@/components/base/loading/loading.component';

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
    clickedSave,
    appointmentId,
}: CreateConsultationType) {
    const { userData } = useAuth() as AuthContextType;
    const { subscribeOnce } = useObservable();
    const dynamicRef = useRef(null);
    const dataRef = useRef(null);
    const [formType, setFormType] = useState(FormType.Create);
    const [dataSource, setDataSource] = useState<DynamicFieldType[]>(getInitialData());
    const [appointment, setAppointment] = useState<Appointments>({});
    const [examinationOption, setExaminationOption] = useState<string>('');
    const [examinationOptions, setExaminationOptions] = useState<ExaminationOptions[]>([]);
    const [patientId, setPatientId] = useState<string>('');
    const [account, setAccount] = useState<DataDefaults>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (visible) {
            getDefaultData();
            getExaminationOptions();
        } else {
            setDataSource(getInitialData());
        }
    }, [visible]);

    const getExaminationOptions = () => {
        if (!appointmentId) return;
        subscribeOnce(ExaminationOptionService.getByPackage(appointmentId), (res: ExaminationOptions[]) => {
            setExaminationOptions(res);
        });
    };

    const getDefaultData = () => {
        if (!appointmentId) return;
        subscribeOnce(AccountService.getDefaultData(appointmentId), (res: DataDefaults) => {
            let doctorId = res.doctorId;
            if (res.doctorId === EMPTY_GUID) {
                doctorId = userData?.id;
            }
            setPatientId(res.patientId ?? '');
            setAppointment({
                id: res.id,
                doctorId: doctorId,
                name: res.fullName,
            });
            setAccount(res);
            let temp = cloneDeep(dataSource);
            temp[DynamicField.Brand].images = [res.organizationThumbnail ?? ''];
            temp[DynamicField.Organization].value = res.organizationName ? `${res.organizationName} hospital` : '';
            temp[DynamicField.OrganizationAddress].value = res.organizationAddress ?? '';
            temp[DynamicField.OrganizationTel].value = res.organizationTel ?? '';
            temp[DynamicField.OrganizationFax].value = res.organizationFax ?? '';
            temp[DynamicField.OrganizationWebsite].value = res.organizationUrl ?? '';
            temp[DynamicField.Fullname].value = res.fullName ?? '';
            temp[DynamicField.YearOfBirth].value = res.dateOfBirth ?? '';
            temp[DynamicField.Gender].value = res.gender ?? '';
            temp[DynamicField.Address].value = res.address ?? '';
            temp[DynamicField.Datetime].value = Date.now();
            temp[DynamicField.DoctorName].value = doctorId ?? '';
            temp[DynamicField.DoctorName].displayValue = res.doctorName ?? '';
            temp[DynamicField.DoctorDD].value = doctorId ?? '';
            temp[DynamicField.DoctorDD].displayValue = res.doctorName ?? '';

            setDataSource(temp);
        });
    };

    function getInitialData() {
        return cloneDeep(dynamicFieldData);
    }

    const handleClosePopup = () => {
        setVisible(false);
    };

    const pinFileToIPFS = async (dataUrl: any) => {
        let ipfsHash = '';

        await fetch(dataUrl)
            .then((res) => res.blob())
            .then(async (blob) => {
                const theImage = new File([blob], `result-${patientId}-${appointment.id}.jpg`, {
                    type: 'image/jpg',
                });
                let formData = new FormData();
                formData.append('file', theImage);

                try {
                    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            pinata_api_key: Environment.PINATA_API_KEY,
                            pinata_secret_api_key: Environment.PINATA_API_SECRET,
                        },
                    });
                    const data = await response.json();
                    ipfsHash = data.IpfsHash;
                    if (!response.ok) {
                        console.error('Uploaded failed!');
                        addToast({
                            text: SystemMessage.UPLOAD_FILE_FAILED,
                            position: ToastPositionEnum.TopRight,
                            status: ToastStatusEnum.InValid,
                        });
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            });

        return ipfsHash;
    };

    const getFilePDF = async () => {
        let theFile;
        let ipfsHash;

        await toPng(dynamicRef.current as unknown as HTMLElement)
            .then(async function (dataUrl: any) {
                let img = new Image();
                img.src = dataUrl;

                ipfsHash = await pinFileToIPFS(dataUrl);

                const doc = new jsPDF();
                const imgProps = doc.getImageProperties(img);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                const pdfX = 0;
                const pdfY = 0;

                doc.addImage(img, 'PNG', pdfX, pdfY, pdfWidth, pdfHeight);

                // Tạo Blob từ PDF
                const pdfBlob = doc.output('blob');
                // Tạo một đối tượng File từ Blob
                const pdfFile = new File([pdfBlob], `result-${patientId}-${appointment.id}.pdf`, {
                    type: 'application/pdf',
                });
                theFile = pdfFile;
            })
            .catch(function (error: any) {
                console.error('Oops, something went wrong!', error);
            });

        return {
            file: theFile,
            ipfsHash,
        };
    };

    const isValidExaminationOption = (): boolean => {
        if (!examinationOption) {
            addToast({
                text: SystemMessage.EXAMINATION_REQUIRED,
                position: ToastPositionEnum.TopRight,
                status: ToastStatusEnum.InValid,
            });
            return false;
        }
        return true;
    };

    const mintAsset = async (payload: any, ipfsHash: any) : Promise<boolean> => {
        if (account) {
            try {
                const walletAddress = account.walletAddress;
                const assetMetadata: AssetMetadata = {
                    id: payload.resultId,
                    ipfsHash: ipfsHash,
                    mediaType: "image/jpg",
                    image: "ipfs://QmQjG9bk8og2pw2Zfbr4BBohR8fattkBWp6zXP7fpRZYYr",
                };
                const assetName = `Careblock_${formatDateToString(new Date())}`;
                const asset: Mint = {
                    assetName,
                    assetQuantity: '1',
                    metadata: assetMetadata,
                    label: '721',
                    recipient: walletAddress,
                };
                const forgingScript = ForgeScript.withOneSignature(walletAddress);
                const wallet = await BrowserWallet.enable('eternl');
                const tx = new Transaction({ initiator: wallet });
                tx.mintAsset(forgingScript, asset);
                tx.setRequiredSigners([walletAddress, account.signerAddress]);
                const unsignedTx = await tx.build();
                const signedTx = await wallet.signTx(unsignedTx, true);
                payload.signHash = signedTx;
                payload.resultName = assetName;

                return true; 
            } catch (err) {
                console.error(err);
                return false; 
            }
        }

        return false;
    };

    const getSavePayload = (file: any) => {
        return {
            examinationOptionId: examinationOption,
            appointmentId: appointment.id ?? '',
            doctorId: appointment.doctorId ?? '',
            diagnostic: JSON.stringify(dataRef.current),
            price: '0',
            filePDF: file,
            resultId: uuidv4(),
            resultName: '',
            signHash: '',
        };
    };

    const setDetailsAppointment = (payload: any) => {
        subscribeOnce(
            AppointmentDetailService.insert({
                ...payload,
                managerWalletAddress: account?.signerAddress,
            }),
            (id: string) => {
                if (id !== EMPTY_GUID) {
                    handleClosePopup();
                    addToast({ text: SystemMessage.INSERT_DIAGNOSTIC_SUCCESS, position: ToastPositionEnum.TopRight });
                    clickedSave();
                } else {
                    addToast({
                        text: SystemMessage.INSERT_DIAGNOSTIC_FAILED,
                        position: ToastPositionEnum.TopRight,
                        status: ToastStatusEnum.InValid,
                    });
                    setFormType(FormType.Create);
                }
            }
        );
    };

    const handleClickSave = () => {
        if (!isValidExaminationOption()) return;

        setIsLoading(true);
        setFormType(FormType.Detail);

        setTimeout(async () => {
            const fileRes = await getFilePDF();
            const payload = getSavePayload(fileRes.file);

            mintAsset(payload, fileRes.ipfsHash).then((res) =>  {
                if(res) {
                    setDetailsAppointment(payload);
                    handleClosePopup();
                    setIsLoading(false);
                }
            }).finally(() => {
                setIsLoading(false);
            });
         
        }, 100);
    };

    const onClickConvertToImage = () => {
        toPng(dynamicRef.current as unknown as HTMLElement)
            .then(function (dataUrl: any) {
                let img = new Image();
                img.src = dataUrl;

                const doc = new jsPDF();
                const imgProps = doc.getImageProperties(img);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                const pdfX = 0;
                const pdfY = 0;

                doc.addImage(img, 'PNG', pdfX, pdfY, pdfWidth, pdfHeight);
                doc.save(`result-${patientId}-${appointment.id}.pdf`);
            })
            .catch(function (error: any) {
                console.error('Oops, something went wrong!', error);
            });
    };

    return (
        <>
            <StyledDialog
                onClose={handleClosePopup}
                aria-labelledby="customized-dialog-title"
                open={visible}
                maxWidth="lg"
            >
                {/* Header */}
                <DialogTitle className="text-[20px]" sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Create Consultation Request
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClosePopup}
                    sx={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Images.CloseIcon className="!text-[28px]" />
                </IconButton>

                {/* Content */}
                <DialogContent dividers>
                    {formType === FormType.Create && (
                        <div className="flex items-center space-x-[12px] mb-[16px]">
                            <p className="font-semibold text-[16px]">Choose an option: </p>
                            <Select
                                name="option"
                                value={examinationOption}
                                size="small"
                                className="w-[300px]"
                                onChange={(event: SelectChangeEvent<any>) => setExaminationOption(event.target.value)}
                            >
                                {examinationOptions?.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    )}
                    <DynamicResult
                        ref={dynamicRef}
                        type={formType}
                        datasource={dataSource}
                        setDataSubmit={(data: any) => (dataRef.current = data)}
                    />
                </DialogContent>

                {/* Footer */}
                <DialogActions>
                    <div className="flex items-center justify-between w-full">
                        <Button variant="contained" onClick={onClickConvertToImage}>
                            Convert to pdf
                        </Button>
                        <div className="flex items-center gap-x-[10px]">
                            <Button variant="text" color="inherit" autoFocus onClick={handleClosePopup}>
                                Cancel
                            </Button>
                            <Button variant="contained" autoFocus onClick={handleClickSave}>
                                Create
                            </Button>
                        </div>
                    </div>
                </DialogActions>
            </StyledDialog>
            <Loading isLoading={isLoading} />
        </>
    );
}
