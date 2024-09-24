import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { IProps } from './popup-confirm-delete.type';

const PopupConfirmDelete = ({
    isVisible,
    onClickCancel,
    onClickConfirm,
    title,
    content,
    cancelText,
    confirmText,
}: IProps) => {
    const theTitle = title ? title : 'Confirm delete';
    const theContent = content ? content : 'Are you sure you want to delete this record?';
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
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{theContent}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClickCancel()}>{theCancelText}</Button>
                <Button onClick={() => onClickConfirm()}>{theConfirmText}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupConfirmDelete;
