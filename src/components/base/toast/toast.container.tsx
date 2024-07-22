import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { removeToast, toast$ } from './toast.service';
import { ToastData } from './toast.type';

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

    return (
        <div
            className={clsx('fixed z-[9999]', {
                'bottom-3 left-3': position === 'bottom-left',
                'bottom-3 right-3': position === 'bottom-right',
                'top-3 left-3': position === 'top-left',
                'top-3 right-3': position === 'top-right',
            })}
        >
            {toasts.map((toast, index) => (
                <div
                    key={index}
                    className={clsx(
                        'flex items-center justify-between w-[300px] min-h-[48px] rounded-sm mb-3 shadow-[0_4px_8px_0_rgb(0,0,0,10%),0_2px_4px_0_rgb(0,0,0,10%),0_0_0_1px_rgb(0,0,0,5%)]',
                        {
                            'bg-[#e54e87]': toast.status === 'inValid',
                            'bg-[#16dd16bf]': toast.status === 'valid',
                            'bg-[#ecf008bf]': toast.status === 'warn',
                        }
                    )}
                >
                    <div className="ml-2 text-black break-words w-[270px] pr-2 py-2 text-xl">{toast.text}</div>

                    <div
                        className="text-2xl text-white mr-2 cursor-pointer"
                        onClick={() => handleRemoveToast(toast.id)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <path
                                fill="#fff"
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
