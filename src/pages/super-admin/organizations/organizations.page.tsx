import { useEffect, useState } from 'react';
import { addToast } from '@/components/base/toast/toast.service';
import useObservable from '@/hooks/use-observable.hook';
import { setTitle } from '@/utils/document';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    InputAdornment,
    Paper,
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
import { columns } from './organizations.const';
import DefaultThumbnail from '@/assets/images/common/organization.png';
import { getNotNullString } from '@/utils/string.helper';
import { INITIAL_ORGANIZATIONS_VALUES } from '@/constants/organizations.const';
import { organizationsSchema } from '@/validations/organizations.validation';
import { Organizations } from '@/types/organization.type';
import OrganizationService from '@/services/organization.service';
import { ToastPositionEnum } from '@/components/base/toast/toast.type';

function OrganizationPage() {
    const { subscribeOnce } = useObservable();
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [organization, setOrganization] = useState<any>();
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [organizationsDisplays, setOrganizationssDisplays] = useState<any[]>([]);
    const [isVisiblePopupAdd, setIsVisiblePopupAdd] = useState<boolean>(false);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);
    const [mode, setMode] = useState<FormMode>(FormMode.Add);
    const [imageSrc, setImageSrc] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<any>();

    const formik = useFormik({
        initialValues: INITIAL_ORGANIZATIONS_VALUES.INFORMATION,
        validationSchema: organizationsSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        setTitle('Organizations | CareBlock');
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
            let result = organizations.filter((org: Organizations) => {
                if (
                    org.id.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    org.code?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    org.name.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    org.city?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    org.district?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    org.address?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    org.tel?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    org.website?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    org.fax?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())
                ) {
                    return org;
                }
            });
            setOrganizationssDisplays(result);
            setPage(0);
        } else setInitialized(false);
    }, [searchValue]);

    const getDatasource = () => {
        subscribeOnce(OrganizationService.getAllOrganization(), (res: Organizations[]) => {
            if (res) {
                setOrganizations(res);
                setOrganizationssDisplays(res);
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

    const handleClickEdit = (org: Organizations) => {
        setMode(FormMode.Update);
        setOrganization(org);
        formik.setFieldValue('id', org.id);
        formik.setFieldValue('code', org.code);
        formik.setFieldValue('name', org.name);
        formik.setFieldValue('city', org.city);
        formik.setFieldValue('district', org.district);
        formik.setFieldValue('address', org.address);
        formik.setFieldValue('mapUrl', org.mapUrl);
        formik.setFieldValue('thumbnail', org.thumbnail);
        formik.setFieldValue('tel', org.tel);
        formik.setFieldValue('website', org.website);
        formik.setFieldValue('fax', org.fax);
        setIsVisiblePopupAdd(true);
    };

    const handleClickRemove = (org: Organizations) => {
        formik.setFieldValue('id', org.id);
        setIsVisiblePopupConfirm(true);
    };

    const onClickAdd = () => {
        setOrganization(null);
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
        subscribeOnce(OrganizationService.delete(formik.values.id), (res: any) => {
            if (!res.isError) {
                setPage(0);
                getDatasource();
                setIsVisiblePopupConfirm(false);
                addToast({ text: SystemMessage.DELETE_ORGANIZATION, position: ToastPositionEnum.TopRight });
            }
        });
    };

    const resetForm = () => {
        setImageSrc('');
        formik.resetForm();
    };

    const handleSubmit = (values: Organizations) => {
        if (mode === FormMode.Add) {
            subscribeOnce(
                OrganizationService.insert({
                    ...values,
                    thumbnail: selectedFile ?? organization?.thumbnail,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.ADD_ORGANIZATION, position: ToastPositionEnum.TopRight });
                    }
                }
            );
        } else {
            if (!values?.id) return;
            subscribeOnce(
                OrganizationService.update(values.id, {
                    ...values,
                    thumbnail: selectedFile ?? organization.thumbnail,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.EDIT_ORGANIZATIONS, position: ToastPositionEnum.TopRight });
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
        <div className="h-full w-[calc(100vw-270px-40px)]">
            <div className="text-[20px] leading-[20px] font-bold">Manage Organizations</div>
            <div className="text-[16px] mb-[10px]">Set up all organizations.</div>
            <div className="toolbar bg-[#f4f4f4] shadow-md rounded-t-md border w-full p-[16px] flex items-center justify-between">
                <TextField
                    variant="outlined"
                    label="Search"
                    size="medium"
                    placeholder="Enter name or description"
                    className="w-[300px]"
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
                <TableContainer className="max-h-[calc(100vh-52px-44px-30px-20px-34px-88px-52px)]">
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
                            {organizationsDisplays
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((org: Organizations) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={org.id}>
                                            {columns.map((column) => {
                                                const value = org[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.id === 'thumbnail' ? (
                                                            <img
                                                                src={getNotNullString(value, DefaultThumbnail)}
                                                                alt="Thumbnail"
                                                                className="w-[100px] max-w-[100%] h-[60px] object-cover"
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
                                                        onClick={() => handleClickEdit(org)}
                                                    />
                                                    <Images.MdDelete
                                                        className="text-[30px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[red]"
                                                        onClick={() => handleClickRemove(org)}
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
                    count={organizationsDisplays.length}
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
                        <p>{mode === FormMode.Add ? 'Add new organization' : 'Update organization'}</p>
                        <Images.MdCancel
                            className="cursor-pointer hover:text-[red] text-[26px]"
                            onClick={() => handleClosePopupAdd()}
                        />
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit} className="w-[500px] flex flex-col gap-y-[10px]">
                        <div className="flex flex-col items-center mb-2">
                            <img
                                className={`${!imageSrc && !organization?.thumbnail && 'p-[8px]'} w-[80px] max-w-[100%] h-[80px] object-cover rounded-[175px] border shadow-xl`}
                                alt="thumbnail"
                                src={
                                    imageSrc
                                        ? imageSrc
                                        : organization?.thumbnail
                                          ? organization.thumbnail
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
                        <div className="flex justify-between gap-[16px]">
                            <div className="flex flex-col w-[30%]">
                                <div>Code:</div>
                                <TextField
                                    id="code"
                                    name="code"
                                    placeholder="Code"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formik.values.code ?? ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.code && Boolean(formik.errors.code)}
                                    helperText={formik.touched.code && formik.errors.code}
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <div>Name:</div>
                                <TextField
                                    id="name"
                                    name="name"
                                    placeholder="Name"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formik.values.name ?? ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between gap-[16px]">
                            <div className="flex flex-col w-[40%]">
                                <div>City:</div>
                                <TextField
                                    id="city"
                                    name="city"
                                    placeholder="City"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formik.values.city ?? ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.city && Boolean(formik.errors.city)}
                                    helperText={formik.touched.city && formik.errors.city}
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <div>District:</div>
                                <TextField
                                    id="district"
                                    name="district"
                                    placeholder="District"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formik.values.district ?? ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.district && Boolean(formik.errors.district)}
                                    helperText={formik.touched.district && formik.errors.district}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <div>Address:</div>
                            <TextField
                                id="address"
                                name="address"
                                placeholder="Address"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formik.values.address ?? ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                            />
                        </div>
                        <div className="flex justify-between gap-[16px]">
                            <div className="flex flex-col w-full">
                                <div>MapUrl:</div>
                                <TextField
                                    id="mapUrl"
                                    name="mapUrl"
                                    placeholder="MapUrl"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formik.values.mapUrl ?? ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.mapUrl && Boolean(formik.errors.mapUrl)}
                                    helperText={formik.touched.mapUrl && formik.errors.mapUrl}
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <div>Tel:</div>
                                <TextField
                                    id="tel"
                                    name="tel"
                                    placeholder="Tel"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formik.values.tel ?? ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.tel && Boolean(formik.errors.tel)}
                                    helperText={formik.touched.tel && formik.errors.tel}
                                />
                            </div>
                        </div>
                        <div className="flex  justify-between gap-[16px]">
                            <div className="flex flex-col w-full">
                                <div>Website:</div>
                                <TextField
                                    id="website"
                                    name="website"
                                    placeholder="Website"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formik.values.website ?? ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.website && Boolean(formik.errors.website)}
                                    helperText={formik.touched.website && formik.errors.website}
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <div>Fax:</div>
                                <TextField
                                    id="fax"
                                    name="fax"
                                    placeholder="Fax"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formik.values.fax ?? ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.fax && Boolean(formik.errors.fax)}
                                    helperText={formik.touched.fax && formik.errors.fax}
                                />
                            </div>
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

export default OrganizationPage;
