import { NotificationType } from '@/enums/NotificationType';
import { NotificationItemType } from './notification.type';
import { useState } from 'react';
import TheBill from '@/pages/doctor/bill/bill.page';

const NotificationItem = ({
    isRead,
    message,
    type,
    link,
    onClickAccept,
    onClickDecline,
    onClickRead,
}: NotificationItemType) => {
    const [isShowBillPopup, setIsShowBillPopup] = useState(false);

    const handleClickBill = () => {
        setIsShowBillPopup(true);
    };

    const handleSetIsShowBillPopup = (type: boolean) => {
        setIsShowBillPopup(type);
    };

    const getContentNoti = () => {
        switch (type) {
            case NotificationType.Invite:
                return (
                    <div className="w-full border border-[#ccc] rounded-md py-[6px] px-[8px] select-none">
                        <div
                            className={`w-full ${isRead ? '' : 'font-bold text-primary flex items-center justify-between cursor-pointer'}`}
                        >
                            <div className="flex-1 mb-[10px]">{message}</div>
                            {!isRead && <div className="font-bold size-[8px] bg-primary rounded-full"></div>}
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-primary text-white py-[4px] px-[12px] rounded-md hover:bg-[#1976d2d9]"
                                onClick={($event) => onClickAccept && onClickAccept($event)}
                            >
                                Accept
                            </button>
                            <button
                                className="bg-[#da2a2a] text-white py-[4px] px-[12px] rounded-md hover:bg-[#da2a2adb]"
                                onClick={($event) => onClickDecline && onClickDecline($event)}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                );
            case NotificationType.Text:
            case NotificationType.Bill:
                return (
                    <>
                        <div
                            className={`w-full border border-[#ccc] rounded-md py-[6px] px-[8px] select-none ${isRead ? '' : 'font-bold text-primary flex items-center justify-between hover:bg-[#ededed] cursor-pointer'}`}
                            onClick={() => onClickRead && onClickRead()}
                        >
                            {!link ? (
                                <div className="flex-1 mb-[10px]">{message}</div>
                            ) : (
                                <div className="flex-1 mb-[10px]">
                                    <div className="mb-[6px]">{message}</div>
                                    <div className="text-light-blue-800 underline mr-[20px]" onClick={handleClickBill}>
                                        Click to open the Link
                                    </div>
                                </div>
                            )}
                            {!isRead && <div className="font-bold size-[8px] bg-primary rounded-full"></div>}
                        </div>
                        <TheBill
                            appointmentId={link!}
                            visible={isShowBillPopup}
                            setVisible={handleSetIsShowBillPopup}
                        />
                    </>
                );
        }
    };

    return getContentNoti();
};

export default NotificationItem;
