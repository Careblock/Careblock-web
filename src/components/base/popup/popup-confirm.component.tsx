import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { IProps } from './popup-confirm.type';
import { getNotNullString } from '@/utils/string.helper';
import { Images } from '@/assets/images';
import { ColorValue } from '@/enums/Color';

const PopupConfirm = ({
    isVisible,
    onClickCancel,
    onClickConfirm,
    title,
    content,
    cancelText,
    confirmText,
}: IProps) => {
    const theTitle = getNotNullString(title, 'Confirm delete');
    const theContent = getNotNullString(content, 'Are you sure you want to delete this record?');
    const theConfirmText = getNotNullString(confirmText, 'Confirm');
    const theCancelText = getNotNullString(cancelText, 'Cancel');

    return (
        <Dialog
            open={isVisible}
            onClose={() => onClickCancel()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <div className="flex items-center gap-[6px]">
                    <Images.AiFillWarning color={ColorValue.error} size={20} />
                    <p className="mt-[2px]">{theTitle}</p>
                </div>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{theContent}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="inherit" onClick={() => onClickCancel()}>
                    {theCancelText}
                </Button>
                <Button onClick={() => onClickConfirm()}>{theConfirmText}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupConfirm;
