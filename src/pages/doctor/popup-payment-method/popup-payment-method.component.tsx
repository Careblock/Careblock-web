import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { IProps } from './popup-payment-method.type';
import { getNotNullString } from '@/utils/string.helper';

const PopupPaymentMethod = ({
    isVisible,
    onClickCancel,
    onClickConfirm,
    title,
    children,
    cancelText,
    confirmText,
}: IProps) => {
    const theTitle = getNotNullString(title, 'Choose payment method');
    const theConfirmText = getNotNullString(confirmText, 'Confirm');
    const theCancelText = getNotNullString(cancelText, 'Cancel');

    return (
        <Dialog
            open={isVisible}
            onClose={() => onClickCancel()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{theTitle}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button color="inherit" onClick={() => onClickCancel()}>
                    {theCancelText}
                </Button>
                <Button onClick={() => onClickConfirm()}>{theConfirmText}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupPaymentMethod;
