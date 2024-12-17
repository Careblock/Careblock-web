import { ReactNode } from 'react';

export interface IProps {
    isVisible: boolean;
    onClickConfirm: Function;
    onClickCancel: Function;
    title?: string;
    children?: ReactNode;
    confirmText?: string;
    cancelText?: string;
}
