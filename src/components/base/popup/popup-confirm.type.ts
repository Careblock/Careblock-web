export interface IProps {
    isVisible: boolean;
    onClickConfirm: Function;
    onClickCancel: Function;
    title?: string;
    content?: string;
    confirmText?: string;
    cancelText?: string;
}
