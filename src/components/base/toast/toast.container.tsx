import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { removeToast, toast$ } from './toast.service';
import { ToastData, ToastPositionEnum, ToastStatusEnum } from './toast.type';
import { Images } from '@/assets/images';
import { ColorValue } from '@/enums/Color';

export default function ToastContainer() {
    const [toasts, setToast] = useState<ToastData[]>([]);
    const [position, setPosition] = useState<string>('');

    useEffect(() => {
        const toastTimers: NodeJS.Timeout[] = [];

        toast$.subscribe((data) => {
            setToast(data.toasts);
            setPosition(data.position);

            if (data.toasts.length) {
                data.toasts.forEach((toast: any) => {
                    const timer = setTimeout(() => {
                        handleRemoveToast(toast.id);
                    }, 3000);

                    toastTimers.push(timer);
                });
            }
        });

        return () => {
            toastTimers.forEach((timer) => clearTimeout(timer));
        };
    }, []);

    const handleRemoveToast = useCallback((id: number) => {
        removeToast(id);
    }, []);

    const getLabelToast = (status: ToastStatusEnum): string => {
        switch (status) {
            case ToastStatusEnum.InValid:
                return 'Error';
            case ToastStatusEnum.Valid:
                return 'Success';
            case ToastStatusEnum.Warn:
                return 'Warning';
            case ToastStatusEnum.Info:
                return 'Info';
            default:
                return '';
        }
    };

    const getIconToast = (status: ToastStatusEnum) => {
        switch (status) {
            case ToastStatusEnum.InValid:
                return <Images.MdCancel className="ml-[14px]" color={ColorValue.error} size={36} />;
            case ToastStatusEnum.Valid:
                return <Images.GoCheckCircleFill className="ml-[14px]" color={ColorValue.success} size={36} />;
            case ToastStatusEnum.Warn:
                return <Images.RiErrorWarningFill className="ml-[14px]" color={ColorValue.warning} size={36} />;
            case ToastStatusEnum.Info:
                return <Images.FaInfoCircle className="ml-[14px]" color={ColorValue.info} size={36} />;
        }
    };

    return (
        <div
            className={clsx('fixed z-[9999]', {
                'bottom-3 left-3': position === ToastPositionEnum.BottomLeft,
                'bottom-3 right-3': position === ToastPositionEnum.BottomRight,
                'top-3 left-3': position === ToastPositionEnum.TopLeft,
                'top-3 right-3': position === ToastPositionEnum.TopRight,
            })}
        >
            {toasts.map((toast, index) => (
                <div
                    key={index}
                    className={clsx(
                        'flex items-center justify-between w-[330px] relative bg-white min-h-[48px] rounded mb-3 shadow-[0_4px_8px_0_rgb(0,0,0,10%),0_2px_4px_0_rgb(0,0,0,10%),0_0_0_1px_rgb(0,0,0,5%)] px-[10px] py-[6px]'
                    )}
                >
                    <div
                        className={clsx(
                            'absolute top-0 left-[-2px] w-[12px] h-[calc(100%+1px)] rounded-tl-md rounded-bl-md',
                            {
                                'bg-[#e23636]': toast.status === ToastStatusEnum.InValid,
                                'bg-[#50b41e]': toast.status === ToastStatusEnum.Valid,
                                'bg-[#edb95e]': toast.status === ToastStatusEnum.Warn,
                                'bg-[#30aafc]': toast.status === ToastStatusEnum.Info,
                            }
                        )}
                    ></div>

                    {getIconToast(toast.status)}

                    <div className="ml-[4px] w-[222px] pr-2 py-2">
                        <div className="text-[16px] font-bold leading-[18px]">{getLabelToast(toast.status)}</div>
                        <div className=" break-words text-[13px] text-[#343434]">{toast.text}</div>
                    </div>

                    <div className="text-2xl mr-2 cursor-pointer" onClick={() => handleRemoveToast(toast.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <path
                                fill="#212121"
                                d="M13.66,11.54a1.5,1.5,0,0,1-2.12,2.12L8,10.12,4.46,13.66a1.5,1.5,0,0,1-2.12-2.12L5.88,
                8,2.34,4.46A1.5,1.5,0,0,1,4.46,2.34L8,5.88l3.54-3.54a1.5,1.5,0,0,1,2.12,2.12L10.12,8Z"
                            />
                        </svg>
                    </div>
                </div>
            ))}
        </div>
    );
}
