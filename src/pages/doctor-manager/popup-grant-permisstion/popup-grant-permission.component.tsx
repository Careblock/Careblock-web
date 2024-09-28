import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { IProps } from './popup-grant-permission.type';

const PopupGrantPermission = ({
    isVisible,
    onClickCancel,
    onClickConfirm,
    title,
    children,
    cancelText,
    confirmText,
}: IProps) => {
    const theTitle = title ? title : 'Grant Permission';
    const theConfirmText = confirmText ? confirmText : 'Confirm';
    const theCancelText = cancelText ? cancelText : 'Cancel';

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
                <Button onClick={() => onClickCancel()}>{theCancelText}</Button>
                <Button onClick={() => onClickConfirm()}>{theConfirmText}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupGrantPermission;
