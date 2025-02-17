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
import { columns } from './specialist.const';
import DefaultThumbnail from '@/assets/images/common/specialist.png';
import { INITIAL_SPECIALIST_VALUES } from '@/constants/specialist.const';
import { editSpecialistsSchema } from '@/validations/specialist.validation';
import { Specialists } from '@/types/specialist.type';
import SpecialistService from '@/services/specialist.service';
import { getNotNullString } from '@/utils/string.helper';
import OrganizationService from '@/services/organization.service';
import { Organizations } from '@/types/organization.type';
import { ToastPositionEnum } from '@/components/base/toast/toast.type';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/stores/global.store';
import { StyledTableCell } from '@/constants/common.const';

function SpecialistPage() {
    const { subscribeOnce } = useObservable();
    const [initialized, setInitialized] = useState(true);
    const collapsed = useSelector((state: GlobalState) => state.system.collapsed);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [specialists, setSpecialists] = useState<any[]>([]);
    const [specialistsDisplays, setSpecialistsDisplays] = useState<any[]>([]);
    const [isVisiblePopupAdd, setIsVisiblePopupAdd] = useState<boolean>(false);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);
    const [mode, setMode] = useState<FormMode>(FormMode.Add);
    const [specialist, setSpecialist] = useState<any>();
    const [imageSrc, setImageSrc] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<any>();
    const [organizations, setOrganizations] = useState<any[]>([]);

    const formik = useFormik({
        initialValues: INITIAL_SPECIALIST_VALUES.INFORMATION,
        validationSchema: editSpecialistsSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        setTitle('Specialist | CareBlock');

        getOrganizations();
        getDatasource();
    }, []);

    useEffect(() => {
        if (!isVisiblePopupAdd) {
            resetForm();
            setMode(FormMode.Add);
        }
    }, [isVisiblePopupAdd]);

    useEffect(() => {
        if (!initialized) {
            let result = specialists.filter((specialist: Specialists) => {
                if (
                    specialist.name.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    specialist.organizationName?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    specialist.description?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())
                ) {
                    return specialist;
                }
            });
            setSpecialistsDisplays(result);
            setPage(0);
        } else setInitialized(false);
    }, [searchValue]);

    const getDatasource = () => {
        subscribeOnce(SpecialistService.getAll(), (res: Specialists[]) => {
            if (res) {
                setSpecialists(res);
                setSpecialistsDisplays(res);
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

    const handleClickEdit = (specialistData: Specialists) => {
        setMode(FormMode.Update);
        formik.setFieldValue('id', specialistData.id);
        formik.setFieldValue('name', specialistData.name);
        formik.setFieldValue('thumbnail', specialistData.thumbnail ?? '');
        setTimeout(() => {
            formik.setFieldValue('organizationId', specialistData.organizationId ?? '');
        }, 10);
        formik.setFieldValue('description', specialistData.description ?? '');
        setSpecialist(specialistData);
        setIsVisiblePopupAdd(true);
    };

    const handleClickRemove = (specialist: Specialists) => {
        formik.setFieldValue('id', specialist.id);
        setIsVisiblePopupConfirm(true);
    };

    const onClickAdd = () => {
        setSpecialist(null);
        setIsVisiblePopupAdd(true);
    };

    const handleClosePopupAdd = () => {
        setIsVisiblePopupAdd(false);
    };

    const handleClosePopupDelete = () => {
        setIsVisiblePopupConfirm(false);
    };

    const handleConfirmDelete = () => {
        if (!formik.values?.id) return;
        subscribeOnce(SpecialistService.delete(formik.values.id), (res: any) => {
            if (!res.isError) {
                setPage(0);
                getDatasource();
                setIsVisiblePopupConfirm(false);
                addToast({ text: SystemMessage.DELETE_SPECIALIST, position: ToastPositionEnum.TopRight });
            }
        });
    };

    const resetForm = () => {
        setImageSrc('');
        formik.resetForm();
    };

    const handleSubmit = (values: Specialists) => {
        if (mode === FormMode.Add) {
            subscribeOnce(
                SpecialistService.insert({
                    ...values,
                    isHidden: false,
                    thumbnail: selectedFile ?? specialist?.thumbnail,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.ADD_SPECIALIST, position: ToastPositionEnum.TopRight });
                    }
                }
            );
        } else {
            if (!values?.id) return;
            subscribeOnce(
                SpecialistService.update(values.id, {
                    ...values,
                    isHidden: false,
                    thumbnail: selectedFile ?? specialist.thumbnail,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.EDIT_SPECIALIST, position: ToastPositionEnum.TopRight });
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
        <div className={`h-full w-[calc(100vw-${collapsed ? '70px' : '200px'}-40px)]`}>
            <div className="text-[20px] leading-[20px] font-bold">Manage Specialists</div>
            <div className="text-[16px] mb-[10px]">
                Set up all specialists that the organization conduct business from.
            </div>
            <div className="toolbar bg-[#f4f4f4] shadow-md rounded-t-md border w-full p-[16px] flex items-center justify-between">
                <TextField
                    variant="outlined"
                    label="Search"
                    size="medium"
                    placeholder="Enter name or description"
                    className="w-[300px] bg-white"
                    value={searchValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSearchValueChanged(event)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Images.SearchIcon className="!text-[28px]" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="contained" onClick={() => onClickAdd()}>
                    Add new
                </Button>
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer className="max-h-[calc(100vh-52px-30px-20px-34px-88px-52px)]">
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <StyledTableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        <div className="font-bold uppercase">{column.label}</div>
                                    </StyledTableCell>
                                ))}
                                <StyledTableCell key="actions" align="center" style={{ minWidth: 150 }}>
                                    <div className="font-bold uppercase">Actions</div>
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {specialistsDisplays
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((specialist: Specialists) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={specialist.id}>
                                            {columns.map((column) => {
                                                const value = specialist[column.id];
                                                return (
                                                    <StyledTableCell key={column.id} align={column.align}>
                                                        {column.id === 'thumbnail' ? (
                                                            <img
                                                                src={getNotNullString(value, DefaultThumbnail)}
                                                                alt="Thumbnail"
                                                                className="w-[100px] h-[60px] object-cover"
                                                            />
                                                        ) : column.format && typeof value === 'number' ? (
                                                            column.format(value)
                                                        ) : (
                                                            value
                                                        )}
                                                    </StyledTableCell>
                                                );
                                            })}
                                            <StyledTableCell key="action" align="center">
                                                <div className="flex items-center justify-center">
                                                    <Images.MdEdit
                                                        className="text-[34px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[black]"
                                                        onClick={() => handleClickEdit(specialist)}
                                                    />
                                                    <Images.MdDelete
                                                        className="text-[34px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[red]"
                                                        onClick={() => handleClickRemove(specialist)}
                                                    />
                                                </div>
                                            </StyledTableCell>
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
                    count={specialistsDisplays.length}
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
                        <p>{mode === FormMode.Add ? 'Add new specialist' : 'Update specialist'}</p>
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
                                className={`${!imageSrc && !specialist?.thumbnail && 'p-[8px]'} w-[80px] h-[80px] object-cover rounded-[175px] border shadow-xl`}
                                alt="thumbnail"
                                src={
                                    imageSrc
                                        ? imageSrc
                                        : specialist?.thumbnail
                                          ? specialist.thumbnail
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
                            <div>Specialist name:</div>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                placeholder="Specialist name"
                                type="text"
                                size="small"
                                variant="outlined"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </div>
                        <div>
                            <div>Organization:</div>
                            <Select
                                className="w-full"
                                name="organizationId"
                                size="small"
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
                            {formik.errors.organizationId && (
                                <FormHelperText>
                                    <span className="text-[#d32f2f] mx-[14px]">{formik.errors.organizationId}</span>
                                </FormHelperText>
                            )}
                        </div>
                        <div className="flex flex-col w-full">
                            <div>Description:</div>
                            <TextField
                                fullWidth
                                id="description"
                                name="description"
                                placeholder="Description"
                                type="text"
                                size="small"
                                variant="outlined"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />
                        </div>
                        <div className="flex items-center justify-end mt-[16px] gap-x-[10px]">
                            <Button variant="text" color="inherit" onClick={handleClosePopupAdd}>
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

export default SpecialistPage;
