import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { BillProps } from './bill.type';
import useObservable from '@/hooks/use-observable.hook';
import { Images } from '@/assets/images';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { useEffect, useState, useRef } from 'react';
import { ExaminationOptions } from '@/types/examinationOption.type';
import Nodata from '@/components/base/no-data/nodata.component';
import { format } from 'date-fns';
import { Bill } from '@/types/result.type';
import ResultService from '@/services/result.service';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function TheBill({ visible, setVisible, appointmentId }: BillProps) {
    const dynamicRef = useRef(null);
    const [bill, setBill] = useState<Bill>();
    const { subscribeOnce } = useObservable();

    useEffect(() => {
        if (visible) {
            subscribeOnce(ResultService.getBill(appointmentId), (res: Bill) => {
                setBill(res);
            });
        }
    }, [visible]);

    const handleClose = () => {
        setVisible(false);
    };

    const onClickConvertToImage = async () => {
        await toPng(dynamicRef.current as unknown as HTMLElement)
            .then(function (dataUrl: any) {
                let img = new Image();
                img.src = dataUrl;

                const doc = new jsPDF();
                const imgProps = doc.getImageProperties(img);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                const pdfX = 0;
                const pdfY = 0;

                doc.addImage(img, 'PNG', pdfX, pdfY, pdfWidth, pdfHeight);
                doc.save('bill.pdf');
            })
            .catch(function (error: any) {
                console.error('Oops, something went wrong!', error);
            })
            .finally(() => {
                handleClose();
            });
    };

    return (
        <StyledDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={visible} maxWidth="lg">
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <Images.CloseIcon className="text-[24px]" />
            </IconButton>

            {/* Content */}
            <DialogContent dividers>
                <div
                    ref={dynamicRef}
                    className="w-[600px] min-h-[420px] max-h-[680px] overflow-y-auto bg-[white] py-[16px] px-[20px]"
                >
                    <h2 className="font-bold text-center text-[18px]">{bill?.examinationPackageName}</h2>
                    <p className="text-center">{bill?.organizationName} hospital</p>
                    <p className="text-center text-[14px]">
                        {bill?.createdDate ? format(bill?.createdDate, 'dd/MM/yyyy') : ''}
                    </p>
                    <div className="mt-[16px] flex justify-between">
                        <div className="left border-r border-[#212121] w-[50%] px-[10px]">
                            <ul>
                                <li>
                                    <b>Patient:</b> {bill?.patientName}
                                </li>
                                <li>
                                    <b>Sex:</b> {bill?.gender}
                                </li>
                                <li>
                                    <b>Address:</b> {bill?.address}
                                </li>
                                <li>
                                    <b>Phone:</b> {bill?.phone}
                                </li>
                            </ul>
                        </div>
                        <div className="right w-[50%] px-[10px]">
                            <ul>
                                <li>
                                    <b>Doctor:</b> {bill?.doctorName}
                                </li>
                                <li>
                                    <b>Department:</b> {bill?.departmentName}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="services mt-[16px]">
                        {bill && bill.examinationOptions?.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="border py-[2px] px-[4px] border-[#212121] w-[40px] text-center">
                                            STT
                                        </th>
                                        <th className="border py-[2px] px-[4px] border-[#212121]">Service</th>
                                        <th className="border py-[2px] px-[4px] border-[#212121] w-[100px] text-right">
                                            Price
                                        </th>
                                        <th className="border py-[2px] px-[4px] border-[#212121] w-[74px] text-center">
                                            Quantity
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bill.examinationOptions.map((option: ExaminationOptions, index: number) => {
                                        return (
                                            <tr key={option.id}>
                                                <td className="border py-[2px] px-[4px] border-[#212121] text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="border py-[2px] px-[4px] border-[#212121]">
                                                    {option.name}
                                                </td>
                                                <td className="border py-[2px] px-[4px] border-[#212121] text-right">
                                                    {option.price}
                                                </td>
                                                <td className="border py-[2px] px-[4px] border-[#212121] text-center">
                                                    1
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    <tr>
                                        <td colSpan={2} className="border py-[2px] px-[4px] border-[#212121]">
                                            Total
                                        </td>
                                        <td
                                            colSpan={2}
                                            className="border py-[2px] px-[4px] border-[#212121] text-right"
                                        >
                                            {bill?.totalPrice}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <div className="w-[200px] mx-auto">
                                <Nodata />
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>

            {/* Footer */}
            <DialogActions>
                <div className="flex items-center justify-end w-full">
                    <div className="flex items-center gap-x-[10px]">
                        <Button variant="text" color="inherit" autoFocus onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" autoFocus onClick={onClickConvertToImage}>
                            Save as pdf
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </StyledDialog>
    );
}
