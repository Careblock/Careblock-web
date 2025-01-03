import { useEffect, useState } from 'react';
import { AuthContextType } from '@/types/auth.type';
import { addToast } from '@/components/base/toast/toast.service';
import useObservable from '@/hooks/use-observable.hook';
import { useAuth } from '@/contexts/auth.context';
import { setTitle } from '@/utils/document';
import DepartmentService from '@/services/department.service';
import { Departments } from '@/types/department.type';
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
import { columns } from './department-management.const';
import { Images } from '@/assets/images';
import { useFormik } from 'formik';
import { INITIAL_DEPARTMENT_VALUES } from '@/constants/department.const';
import { departmentSchema } from '@/validations/department.validation';
import { SystemMessage } from '@/constants/message.const';
import { FormMode } from '@/enums/FormMode';
import PopupConfirmDelete from '@/components/base/popup/popup-confirm-delete.component';
import { ToastPositionEnum } from '@/components/base/toast/toast.type';

function DepartmentManagement() {
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [departments, setDepartments] = useState<any[]>([]);
    const [departmentDisplays, setDepartmentDisplays] = useState<any[]>([]);
    const [organizationId, setOrganizationId] = useState<string>('');
    const [isVisiblePopupAdd, setIsVisiblePopupAdd] = useState<boolean>(false);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);
    const [mode, setMode] = useState<FormMode>(FormMode.Add);

    const formik = useFormik({
        initialValues: INITIAL_DEPARTMENT_VALUES.INFORMATION,
        validationSchema: departmentSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        setTitle('Departments | CareBlock');

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
            let result = departments.filter((department: Departments) => {
                if (
                    department.name.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    department.location?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())
                ) {
                    return department;
                }
            });
            setDepartmentDisplays(result);
            setPage(0);
        } else setInitialized(false);
    }, [searchValue]);

    const getDatasource = () => {
        if (!userData?.id) return;
        subscribeOnce(DepartmentService.getByUserId(userData.id), (res: Departments[]) => {
            if (res) {
                setDepartments(res);
                setOrganizationId(res[0].organizationId!);
                setDepartmentDisplays(res);
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

    const handleClickEdit = (department: Departments) => {
        setMode(FormMode.Update);
        formik.setFieldValue('id', department.id);
        formik.setFieldValue('name', department.name);
        formik.setFieldValue('location', department.location ?? '');
        setIsVisiblePopupAdd(true);
    };

    const handleClickRemove = (department: Departments) => {
        formik.setFieldValue('id', department.id);
        setIsVisiblePopupConfirm(true);
    };

    const onClickAdd = () => {
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
        subscribeOnce(DepartmentService.delete(formik.values.id), (res: any) => {
            if (!res.isError) {
                setPage(0);
                getDatasource();
                setIsVisiblePopupConfirm(false);
                addToast({ text: SystemMessage.DELETE_DEPARTMENT, position: ToastPositionEnum.TopRight });
            }
        });
    };

    const handleSubmit = (values: Departments) => {
        if (mode === FormMode.Add) {
            subscribeOnce(
                DepartmentService.insert({
                    ...values,
                    organizationId: organizationId,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.ADD_DEPARTMENT, position: ToastPositionEnum.TopRight });
                    }
                }
            );
        } else {
            if (!values?.id) return;
            subscribeOnce(
                DepartmentService.update(values.id, {
                    ...values,
                    organizationId: organizationId,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.EDIT_DEPARTMENT, position: ToastPositionEnum.TopRight });
                    }
                }
            );
        }
    };

    return (
        <div className="h-full">
            <div className="text-[20px] leading-[20px] font-bold">Manage Departments</div>
            <div className="text-[16px] mb-[10px]">
                Set up all departments that your organization conduct business from.
            </div>
            <div className="toolbar bg-[#f4f4f4] shadow-md rounded-t-md border w-full p-[16px] flex items-center justify-between">
                <TextField
                    variant="outlined"
                    label="Search"
                    size="medium"
                    placeholder="Enter name or location"
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
                            {departmentDisplays
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((department: Departments) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={department.id}>
                                            {columns.map((column) => {
                                                const value = department[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell key="action" align="center">
                                                <div className="flex items-center justify-center">
                                                    <Images.MdEdit
                                                        className="text-[30px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[black]"
                                                        onClick={() => handleClickEdit(department)}
                                                    />
                                                    <Images.MdDelete
                                                        className="text-[30px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[red]"
                                                        onClick={() => handleClickRemove(department)}
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
                    count={departmentDisplays.length}
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
                        <p>{mode === FormMode.Add ? 'Add new department' : 'Update department'}</p>
                        <Images.MdCancel
                            className="cursor-pointer hover:text-[red] text-[26px]"
                            onClick={() => handleClosePopupAdd()}
                        />
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit} className="w-[400px] flex flex-col gap-y-[10px]">
                        <TextField
                            id="name"
                            name="name"
                            placeholder="Department name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            id="location"
                            name="location"
                            placeholder="Enter location"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.location && Boolean(formik.errors.location)}
                            helperText={formik.touched.location && formik.errors.location}
                        />
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

export default DepartmentManagement;
