export type ToastStatus = 'valid' | 'inValid' | 'warn' | 'info';

export enum ToastStatusEnum {
    Valid = 'valid',
    InValid = 'inValid',
    Warn = 'warn',
    Info = 'info',
}

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right';

export enum ToastPositionEnum {
    TopRight = 'top-right',
    TopLeft = 'top-left',
    BottomLeft = 'bottom-left',
    BottomRight = 'bottom-right',
}

export interface ToastItemProps {
    status: ToastStatus;
    children: React.ReactNode;
    onClose: () => void;
}

export interface ToastSubject {
    position: string;
    toasts: ToastData[];
}

export interface ToastData {
    id: number;
    text: string;
    /**
     * Default: 'valid'
     */
    status: ToastStatusEnum;
    /**
     * This flag will help you keep displaying toast of previous page.
     * - true: automatically remove toast when route changed.
     * - false: keep displaying toast when route changed(1 time),
     */
    removeOnNextNavigating: boolean;
}

export interface ToastOpts {
    text: string;
    /**
     * Default: 'valid'
     */
    status?: ToastStatusEnum;
    /**
     * Default: 'bottom-right'
     */
    position?: ToastPosition;
    /**
     * This flag will help you keep displaying toast of previous page.
     * - true: automatically remove toast when route changed.
     * - false: keep displaying toast when route changed(1 time),
     *
     * Default: true.
     */
    removeOnNextNavigating?: boolean;
}
