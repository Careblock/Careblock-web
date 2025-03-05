import { Button, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import CreateConsultation from '../create-consultation/create-consultation.page';
import { formatDateToString, formatStandardDate } from '@/utils/datetime.helper';
import { getFullName, getGenderName, textToHex } from '@/utils/common.helpers';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { DetailsInfoType } from './details-info.type';
import { Images } from '@/assets/images';
import { GENDER, ScheduleTabs } from '@/enums/Common';
import ResultService from '@/services/result.service';
import useObservable from '@/hooks/use-observable.hook';
import { Bill, Results } from '@/types/result.type';
import { useSelector } from 'react-redux';
import { NotificationState } from '@/stores/notification';
import * as signalR from '@microsoft/signalr';
import { NotificationType } from '@/enums/NotificationType';
import { Notifications } from '@/types/notification.type';
import { AuthContextType } from '@/types/auth.type';
import { useAuth } from '@/contexts/auth.context';
import { addToast } from '@/components/base/toast/toast.service';
import { SystemMessage } from '@/constants/message.const';
import AccountService from '@/services/account.service';
import { DataDefaults } from '@/types/dataDefault.type';
import TheBill from '../bill/bill.page';
import { BillEnum } from './details-info.const';
import { ToastPositionEnum, ToastStatusEnum } from '@/components/base/toast/toast.type';
import { Asset, AssetMetadata, BrowserWallet, ForgeScript, Mint, Transaction } from '@meshsdk/core';
import { RESULT_STATUS } from '@/enums/Result';
import { Color } from '@/enums/Color';
import { PAYMENT_STATUS, PAYMENT_STATUS_NAME } from '@/enums/Payment';
import PaymentService from '@/services/payment.service';
import { Payments } from '@/types/payment.type';
import { EMPTY_GUID } from '@/constants/common.const';
import PopupPaymentMethod from '../popup-payment-method/popup-payment-method.component';
import { PaymentMethods } from '@/types/paymentMethods.type';
import PaymentMethodService from '@/services/paymentMethod.service';

const DetailsInfo = ({ currentTab, dataSource, clickedSave }: DetailsInfoType) => {
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [result, setResult] = useState<Results[]>([]);
    const [isPaid, setIsPaid] = useState<boolean>(false);
    const [dataDefault, setDataDefault] = useState<DataDefaults>();
    const [isShowCreatePopup, setIsShowCreatePopup] = useState(false);
    const [isShowBillPopup, setIsShowBillPopup] = useState(false);
    const [isShowPaymentMethodPopup, setIsShowPaymentMethodPopup] = useState(false);
    const [isReloadData, setIsReloadData] = useState<boolean>(false);
    const connection = useSelector((state: { notification: NotificationState }) => state.notification.connection);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>('');
    const [selectedResult, setSelectedResult] = useState<Results>();
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([]);
    const [bill, setBill] = useState<Bill>();
    const [walletAddress, setWalletAddress] = useState<string>('');

    useEffect(() => {
        const getWalletAddress = async () => {
            let address = '';
            const wallet = await BrowserWallet.enable('eternl');
            const lstUsedAddress = await wallet.getUsedAddresses();
            if (lstUsedAddress?.length > 0) {
                address = lstUsedAddress[0];
            }
            if (!address) {
                const lstUnUsedAddress = await wallet.getUnusedAddresses();
                if (lstUnUsedAddress?.length > 0) {
                    address = lstUnUsedAddress[0];
                }
            }
            setWalletAddress(address);
        };

        getWalletAddress();
        getBillData();
    }, []);

    useEffect(() => {
        if (!dataSource?.appointmentId) return;
        subscribeOnce(ResultService.getByAppointmentID(dataSource.appointmentId), (res: Results[]) => {
            setResult(res);
        });

        if (currentTab === ScheduleTabs.CHECKEDIN) {
            getDataDefault(dataSource.appointmentId);
            getPaymentStatus(dataSource.appointmentId);
        }
    }, [dataSource, isReloadData]);

    const getBillData = () => {
        subscribeOnce(ResultService.getBill(dataSource.appointmentId!), (res: Bill) => {
            setBill(res);
        });
    };

    const getDataDefault = (appointmentId: string) => {
        if (appointmentId === undefined) return;
        subscribeOnce(AccountService.getDefaultData(appointmentId), (res: DataDefaults) => {
            setDataDefault(res);
        });
    };

    const getPaymentStatus = (appointmentId: string) => {
        if (appointmentId === undefined) return;
        subscribeOnce(PaymentService.getPaidByAppointmentId(appointmentId), (res: Payments) => {
            if (res.id !== EMPTY_GUID) setIsPaid(true);
            else setIsPaid(false);
        });
    };

    const getPaymentMethods = () => {
        subscribeOnce(PaymentMethodService.getAll(), (res: PaymentMethods[]) => {
            if (res) {
                setPaymentMethods(res);
                if (res.length > 0) setSelectedPaymentMethod(res[0].id);
            }
        });
    };

    const handleSendResult = async (result: any) => {
        try {
            const wallet = await BrowserWallet.enable('eternl');
            await wallet.getUsedAddresses();
            const policyId = await wallet.getPolicyIds();
            const tx = new Transaction({ initiator: wallet });
            const asset: Asset = {
                unit: policyId[0] + textToHex(result.hashName),
                quantity: '1',
            };

            tx.sendAssets(dataSource.walletAddress, [asset]);
            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx, true);
            await wallet.submitTx(signedTx);

            pushNotification(result, BillEnum.RESULT_VALUE);
            subscribeOnce(ResultService.send(result.id), () => {
                setIsReloadData(true);
            });
        } catch (err) {
            addToast({
                text: SystemMessage.SEND_RESULT_FAILED,
                position: ToastPositionEnum.TopRight,
                status: ToastStatusEnum.InValid,
            });
        }
    };

    const pushNotification = (result: Results, type: BillEnum) => {
        let isError = false;

        if (connection.state === signalR.HubConnectionState.Connected) {
            let notificationTypeId = NotificationType.Text;
            let message = `${dataDefault?.doctorName} has sent you the results of your medical examination.`;
            let link = result.diagnosticUrl;
            if (type === BillEnum.BILL_VALUE) {
                notificationTypeId = NotificationType.Bill;
                message = `${dataDefault?.doctorName} has sent you the bill of your medical examination.`;
                link = dataSource.appointmentId ?? '';
            }
            connection
                .invoke('SendNotification', {
                    accountId: dataSource.id,
                    notificationTypeId: notificationTypeId,
                    message: message,
                    link: link,
                    originId: userData?.id,
                    isRead: false,
                } as Notifications)
                .catch((error: any) => {
                    isError = true;
                    console.error('Lỗi khi gọi SignalR: ', error);
                });
        } else {
            connection
                .start()
                .then(() => {
                    let notificationTypeId = NotificationType.Text;
                    let message = `${dataDefault?.doctorName} has sent you the results of your medical examination.`;
                    let link = result.diagnosticUrl;
                    if (type === BillEnum.BILL_VALUE) {
                        notificationTypeId = NotificationType.Bill;
                        message = `${dataDefault?.doctorName} has sent you the bill of your medical examination.`;
                        link = dataSource.appointmentId ?? '';
                    }
                    connection
                        .invoke('SendNotification', {
                            accountId: dataSource.id,
                            notificationTypeId: notificationTypeId,
                            message: message,
                            link: link,
                            originId: userData?.id,
                            isRead: false,
                        } as Notifications)
                        .catch((error: any) => {
                            isError = true;
                            console.error('Lỗi khi gọi SignalR: ', error);
                        });
                })
                .catch((error: any) => {
                    isError = true;
                    console.error('Lỗi khi kết nối SignalR: ', error);
                });
        }
        if (!isError) {
            addToast({
                text: type === BillEnum.RESULT_VALUE ? SystemMessage.SEND_RESULT : SystemMessage.SEND_BILL,
                position: ToastPositionEnum.TopRight,
            });
        }
    };

    const handleClosePopupEdit = () => {
        setIsShowPaymentMethodPopup(false);
    };

    const mintPayment = async () => {
        if (bill) {
            try {
                const assetMetadata: AssetMetadata = {
                    doctorName: bill.doctorName,
                    departmentName: bill.departmentName,
                    organizationName: bill.organizationName,
                    examinationPackageName: bill.examinationPackageName,
                    patientName: bill.patientName,
                    gender: bill.gender,
                    totalPrice: `${bill.totalPrice}`,
                };
                const assetName = `bill_${formatDateToString(new Date())}`;
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
                const unsignedTx = await tx.build();
                const signedTx = await wallet.signTx(unsignedTx);
                const txHash = await wallet.submitTx(signedTx);
                return txHash;
            } catch (err) {
                console.error(err);
                return undefined;
            }
        }
    };

    const handleConfirmEdit = async () => {
        const paidHash = await mintPayment();

        const payload: Payments = {
            appointmentId: selectedResult?.appointmentId ?? '',
            name: '',
            paymentMethodId: selectedPaymentMethod,
            status: PAYMENT_STATUS.PAID,
            total: 0,
            paidHash: paidHash,
        };

        subscribeOnce(
            PaymentService.updateByAppointment(selectedResult?.appointmentId ?? '', payload),
            (appointmentId: string) => {
                if (appointmentId !== EMPTY_GUID) {
                    handleClosePopupEdit();
                    setIsPaid(true);
                    addToast({
                        text: SystemMessage.MARK_AS_PAID,
                        position: ToastPositionEnum.TopRight,
                        status: ToastStatusEnum.Valid,
                    });
                    getPaymentStatus(appointmentId);
                } else {
                    handleClosePopupEdit();
                    addToast({
                        text: SystemMessage.MARKED_PAID_FAILED,
                        position: ToastPositionEnum.TopRight,
                        status: ToastStatusEnum.Warn,
                    });
                }
            }
        );
    };

    const handleClickPaid = (item: Results) => {
        getPaymentMethods();
        setSelectedResult(item);
        setIsShowPaymentMethodPopup(true);
    };

    const handleSelectPaymentMethod = (event: any) => {
        const { target: value } = event;
        setSelectedPaymentMethod(value.value);
    };

    const handleClickAccoummodate = () => {
        setIsShowCreatePopup(true);
    };

    const handleSetIsShowCreatePopup = (type: boolean) => {
        setIsShowCreatePopup(type);
    };

    const handleClickBill = () => {
        setIsShowBillPopup(true);
    };

    const handleSetIsShowBillPopup = (type: boolean) => {
        setIsShowBillPopup(type);
    };

    const getStatusText = () => {
        if (isPaid) return PAYMENT_STATUS_NAME.PAID;
        return PAYMENT_STATUS_NAME.UNPAID;
    };

    const getStatusColor = () => {
        if (isPaid) return Color.success;
        return Color.warning;
    };

    return (
        <>
            <div className="details__wrapper w-full overflow-hidden bg-white p-4 shadow-md rounded-lg">
                <div className="details__top flex flex-col items-center justify-between">
                    <div className="details-top__left flex flex-col items-center justify-center">
                        <div className="top-left__avatar overflow-hidden rounded-full w-[60px] h-[60px]">
                            <img
                                src={dataSource?.avatar ? dataSource?.avatar : avatarDefault}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="top-left__name mt-1 mb-3 text-[18px] font-semibold">
                            {getFullName(dataSource)}
                        </div>
                    </div>
                    <div className="details-top__right space-y-2 select-none">
                        {dataSource.gender && (
                            <div className="gender flex items-center justify-center">
                                {dataSource.gender === GENDER.FEMALE ? (
                                    <Images.FemaleIcon className="text-[18px] text-[#4e4e4e]" />
                                ) : (
                                    <Images.MaleIcon className="text-[18px] text-[#4e4e4e]" />
                                )}
                                <div className="text text-[#4e4e4e] ml-1">{getGenderName(dataSource.gender)}</div>
                            </div>
                        )}
                        {dataSource.dateOfBirth && (
                            <div className="date-of-birth flex items-center justify-center">
                                <Images.CakeIcon className="text-[18px] text-[#4e4e4e]" />
                                <div className="text text-[#4e4e4e] ml-1">
                                    {formatStandardDate(new Date(dataSource.dateOfBirth))}
                                </div>
                            </div>
                        )}
                        {dataSource.phone && (
                            <div className="phone flex items-center justify-center">
                                <Images.PhoneAndroidIcon className="text-[18px] text-[#4e4e4e]" />
                                <div className="text text-[#4e4e4e] ml-1">{dataSource.phone}</div>
                            </div>
                        )}
                        {dataSource.email && (
                            <div className="email flex items-center justify-center">
                                <Images.MailOutlineIcon className="text-[18px] text-[#4e4e4e]" />
                                <div className="text text-[#4e4e4e] ml-1">{dataSource.email}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="details__content shadow-3 w-full px-4 mt-3 py-8">
                    {result?.length <= 0 ? (
                        <div className="details-content__nodata flex items-center flex-col justify-center">
                            <div className="text-[16px] mb-3">Would you like to begin serving this patient?</div>
                            <Button variant="contained" onClick={handleClickAccoummodate}>
                                Create Consultation
                            </Button>
                        </div>
                    ) : (
                        <ul>
                            {result.map((item: Results) => (
                                <li key={item.id} className="text-[16px]">
                                    <div className="flex items-center justify-center">
                                        <p className="ml-[8px] mr-[10px]">Result:</p>
                                        <a
                                            href={item.diagnosticUrl}
                                            className="text-light-blue-800 hover:underline mr-[20px]"
                                        >
                                            File PDF
                                        </a>
                                        {item.status == RESULT_STATUS.SIGNED && (
                                            <Button variant="outlined" onClick={() => handleSendResult(item)}>
                                                Send result
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex items-center mt-[12px] justify-center">
                                        <p className="ml-[8px] mr-[10px]">Bill:</p>
                                        <p
                                            className="cursor-pointer text-light-blue-800 hover:underline mr-[20px]"
                                            onClick={handleClickBill}
                                        >
                                            File PDF
                                        </p>

                                        <Button
                                            variant="outlined"
                                            onClick={() => pushNotification(item, BillEnum.BILL_VALUE)}
                                        >
                                            Send bill
                                        </Button>

                                        {!isPaid && (
                                            <>
                                                <div className="ml-[20px]"></div>

                                                <Button variant="outlined" onClick={() => handleClickPaid(item)}>
                                                    Mark as paid
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                    <div className="w-full flex items-center justify-center mt-[20px]">
                                        <Chip
                                            className="w-[180px] select-none"
                                            variant="outlined"
                                            label={getStatusText()}
                                            color={getStatusColor()}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <CreateConsultation
                appointmentId={dataSource.appointmentId!}
                patientId={dataSource.id}
                visible={isShowCreatePopup}
                setVisible={handleSetIsShowCreatePopup}
                clickedSave={clickedSave}
            />
            <TheBill bill={bill} visible={isShowBillPopup} setVisible={handleSetIsShowBillPopup} />
            {/* Edit information */}
            <PopupPaymentMethod
                isVisible={isShowPaymentMethodPopup}
                onClickCancel={handleClosePopupEdit}
                onClickConfirm={handleConfirmEdit}
            >
                {
                    <div className="flex flex-col items-start w-[400px] select-none">
                        <FormControl sx={{ m: 1, width: 380 }}>
                            <InputLabel id="payment-method-label">Payment Method</InputLabel>
                            <Select
                                size="medium"
                                className="w-full"
                                labelId="payment-method-label"
                                value={selectedPaymentMethod}
                                onChange={handleSelectPaymentMethod}
                                input={<OutlinedInput id="select-payment-method" label="Payment Method" />}
                            >
                                {paymentMethods.map((item: PaymentMethods) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                }
            </PopupPaymentMethod>
        </>
    );
};

export default DetailsInfo;
