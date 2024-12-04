import { useEffect, useState } from 'react';
import { addToast } from '@/components/base/toast/toast.service';
import useObservable from '@/hooks/use-observable.hook';
import { setTitle } from '@/utils/document';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormHelperText,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from '@mui/material';
import { Images } from '@/assets/images';
import { useFormik } from 'formik';
import { SystemMessage } from '@/constants/message.const';
import { FormMode } from '@/enums/FormMode';
import PopupConfirmDelete from '@/components/base/popup/popup-confirm-delete.component';
import { columns } from './examination-package.const';
import { INITIAL_EXAMINATION_PACKAGES_VALUES } from '@/constants/examinationPackage.const';
import { editExaminationPackagesSchema, examinationPackagesSchema } from '@/validations/examinationPackage.validation';
import { ExaminationPackages } from '@/types/examinationPackage.type';
import ExaminationPackageService from '@/services/examinationPackage.service';
import DefaultThumbnail from '@/assets/images/common/package.jpg';
import ExaminationTypeService from '@/services/examinationType.service';
import { ExaminationTypes } from '@/types/examinationType.type';
import OrganizationService from '@/services/organization.service';
import { Organizations } from '@/types/organization.type';

function ExaminationPackage() {
    const { subscribeOnce } = useObservable();
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [examinationPackages, setExaminationPackages] = useState<any[]>([]);
    const [examinationPackagesDisplays, setExaminationPackagesDisplays] = useState<any[]>([]);
    const [isVisiblePopupAdd, setIsVisiblePopupAdd] = useState<boolean>(false);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);
    const [mode, setMode] = useState<FormMode>(FormMode.Add);
    const [examinationPackage, setExaminationPackage] = useState<any>();
    const [imageSrc, setImageSrc] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<any>();
    const [examinationTypes, setExaminationTypes] = useState<any[]>([]);
    const [organizations, setOrganizations] = useState<any[]>([]);

    const formik = useFormik({
        initialValues: INITIAL_EXAMINATION_PACKAGES_VALUES.INFORMATION,
        validationSchema: mode === FormMode.Add ? examinationPackagesSchema : editExaminationPackagesSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        setTitle('Examination Packages | CareBlock');

        getOrganizations();
        getExaminationType();
        getDatasource();
    }, []);

    useEffect(() => {
        if (!isVisiblePopupAdd) {
            formik.resetForm();
            setMode(FormMode.Add);
        }
    }, [isVisiblePopupAdd]);

    useEffect(() => {
        if (!initialized) {
            let result = examinationPackages.filter((examinationPackage: ExaminationPackages) => {
                if (examinationPackage.name.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())) {
                    return examinationPackage;
                }
            });
            setExaminationPackagesDisplays(result);
            setPage(0);
        } else setInitialized(false);
    }, [searchValue]);

    const getDatasource = () => {
        subscribeOnce(ExaminationPackageService.getAll(), (res: ExaminationPackages[]) => {
            if (res) {
                setExaminationPackages(res);
                setExaminationPackagesDisplays(res);
            }
        });
    };

    const getOrganizations = () => {
        subscribeOnce(OrganizationService.getAllOrganization(), (res: Organizations[]) => {
            if (res) {
                setOrganizations(res);
            }
        });
    };

    const getExaminationType = () => {
        subscribeOnce(ExaminationTypeService.getAll(), (res: ExaminationTypes[]) => {
            if (res) {
                setExaminationTypes(res);
            }
        });
    };

    const handleSearchValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickEdit = (examinationPackage: ExaminationPackages) => {
        setMode(FormMode.Update);
        setExaminationPackage(examinationPackage);
        formik.setFieldValue('id', examinationPackage.id);
        formik.setFieldValue('name', examinationPackage.name);
        formik.setFieldValue('thumbnail', examinationPackage.thumbnail);
        setTimeout(() => {
            formik.setFieldValue('organizationId', examinationPackage.organizationId);
        }, 10);
        if (examinationPackage.examinationTypeId) {
            setTimeout(() => {
                formik.setFieldValue('examinationTypeId', examinationPackage.examinationTypeId);
            }, 10);
        }
        setIsVisiblePopupAdd(true);
    };

    const handleClickRemove = (examinationPackage: ExaminationPackages) => {
        formik.setFieldValue('id', examinationPackage.id);
        setIsVisiblePopupConfirm(true);
    };

    const onClickAdd = () => {
        setExaminationPackage(null);
        setIsVisiblePopupAdd(true);
    };

    const handleClosePopupAdd = () => {
        setIsVisiblePopupAdd(false);
    };

    const handleClosePopupDelete = () => {
        setIsVisiblePopupConfirm(false);
    };

    const handleChangeExaminationType = ($event: any) => {
        formik.setFieldValue('examinationTypeId', $event.target.value);
    };

    const handleConfirmDelete = () => {
        if (!formik.values?.id) return;
        subscribeOnce(ExaminationPackageService.delete(formik.values.id), (res: any) => {
            if (!res.isError) {
                setPage(0);
                getDatasource();
                setIsVisiblePopupConfirm(false);
                addToast({ text: SystemMessage.DELETE_EXAMINATION_PACKAGE, position: 'top-right' });
            }
        });
    };

    const resetForm = () => {
        setImageSrc('');
        formik.resetForm();
    };

    const handleSubmit = (values: ExaminationPackages) => {
        if (mode === FormMode.Add) {
            if (!values.examinationTypeId) {
                addToast({ text: SystemMessage.EXAMINATION_TYPE_REQUIRED, position: 'top-right', status: 'inValid' });
                return;
            }
            subscribeOnce(
                ExaminationPackageService.insertNew({
                    ...values,
                    isDeleted: false,
                    thumbnail: selectedFile ?? examinationPackage?.thumbnail,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.ADD_EXAMINATION_PACKAGE, position: 'top-right' });
                    }
                }
            );
        } else {
            if (!values?.id) return;
            subscribeOnce(
                ExaminationPackageService.update(values.id, {
                    ...values,
                    isDeleted: false,
                    thumbnail: selectedFile ?? examinationPackage?.thumbnail,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.EDIT_EXAMINATION_PACKAGE, position: 'top-right' });
                    }
                }
            );
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const t = URL.createObjectURL(file);
            setImageSrc(t);
        }
    };

    return (
        <div className="h-full">
            <div className="text-[24px]">Manage Examination Packages</div>
            <div className="text-[16px] mb-4">
                Set up all examination packages that the organization conduct business from.
            </div>
            <div className="toolbar bg-[#f4f4f4] shadow-md rounded-t-md border w-full p-[16px] flex items-center justify-between">
                <TextField
                    variant="outlined"
                    label="Search"
                    size="small"
                    placeholder="Enter name"
                    className="w-[260px]"
                    value={searchValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSearchValueChanged(event)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Images.SearchIcon className="text-[24px]" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="contained" onClick={() => onClickAdd()}>
                    Add new
                </Button>
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer className="max-h-[calc(100vh-52px-52px-30px-24px-30px-72px-52px-26px)]">
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        <div className="font-bold uppercase">{column.label}</div>
                                    </TableCell>
                                ))}
                                <TableCell key="actions" align="center" style={{ minWidth: 150 }}>
                                    <div className="font-bold uppercase">Actions</div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {examinationPackagesDisplays
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((examinationPackage: ExaminationPackages) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={examinationPackage.id}>
                                            {columns.map((column) => {
                                                const value = examinationPackage[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.id === 'thumbnail' ? (
                                                            <img
                                                                src={value ? value : DefaultThumbnail}
                                                                alt="Thumbnail"
                                                                className="w-[100px] h-[60px] object-cover"
                                                            />
                                                        ) : column.format && typeof value === 'number' ? (
                                                            column.format(value)
                                                        ) : (
                                                            value
                                                        )}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell key="action" align="center">
                                                <div className="flex items-center justify-center">
                                                    <Images.MdEdit
                                                        className="text-[30px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[black]"
                                                        onClick={() => handleClickEdit(examinationPackage)}
                                                    />
                                                    <Images.MdDelete
                                                        className="text-[30px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[red]"
                                                        onClick={() => handleClickRemove(examinationPackage)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    className="border-t bg-[#f4f4f4]"
                    count={examinationPackagesDisplays.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Popup Add */}
            <Dialog open={isVisiblePopupAdd} onClose={handleClosePopupAdd}>
                <DialogTitle>
                    <div className="flex items-center justify-between">
                        <p>Add new examination package</p>
                        <Images.MdCancel
                            className="cursor-pointer hover:text-[red] text-[26px]"
                            onClick={() => handleClosePopupAdd()}
                        />
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit} className="w-[400px] flex flex-col gap-y-[10px]">
                        <div className="flex flex-col items-center mb-2">
                            <img
                                className={`${!imageSrc && !examinationPackage?.thumbnail && 'p-[8px]'} w-[80px] h-[80px] object-cover rounded-[175px] border shadow-xl`}
                                alt="thumbnail"
                                src={
                                    imageSrc
                                        ? imageSrc
                                        : examinationPackage?.thumbnail
                                          ? examinationPackage.thumbnail
                                          : DefaultThumbnail
                                }
                            />
                            <div className="my-3">
                                <label
                                    htmlFor="thumbnail"
                                    className="py-2 px-3 rounded-md shadow-xl block font-medium text-white cursor-pointer bg-blue-gray-300"
                                >
                                    Upload Thumbnail
                                </label>
                                <input
                                    id="thumbnail"
                                    name="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only mt-1 focus:ring-blue-500 focus:border-blue-500 block shadow-sm border-gray-300 rounded"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <div>Package name:</div>
                            <TextField
                                id="name"
                                name="name"
                                placeholder="Examination package name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <div>Examination type:</div>
                            <Select
                                className="w-full"
                                size="medium"
                                displayEmpty
                                value={formik.values.examinationTypeId ?? ''}
                                onChange={($event: any) => handleChangeExaminationType($event)}
                            >
                                {examinationTypes.map((item: any) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div className="mt-[20px]">
                            <div>Organization:</div>
                            <Select
                                className="w-full"
                                name="organizationId"
                                size="medium"
                                value={formik.values.organizationId ?? ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.organizationId && Boolean(formik.errors.organizationId)}
                            >
                                {organizations.map((item: Organizations) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                <span className="text-[#d32f2f] mx-[14px]">{formik.errors.organizationId}</span>
                            </FormHelperText>
                        </div>
                        <div className="flex items-center justify-end mt-[16px] gap-x-[10px]">
                            <Button variant="text" onClick={handleClosePopupAdd}>
                                Cancel
                            </Button>
                            <Button variant="contained" type="submit">
                                {mode === FormMode.Add ? 'Add' : 'Update'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <PopupConfirmDelete
                isVisible={isVisiblePopupConfirm}
                onClickCancel={handleClosePopupDelete}
                onClickConfirm={handleConfirmDelete}
            />
        </div>
    );
}

export default ExaminationPackage;
