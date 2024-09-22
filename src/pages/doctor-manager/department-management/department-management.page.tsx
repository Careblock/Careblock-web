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

function DepartmentManagement() {
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [departments, setDepartments] = useState<any[]>([]);
    const [departmentDisplays, setDepartmentDisplays] = useState<any[]>([]);

    useEffect(() => {
        setTitle('Departments | CareBlock');
    }, []);

    useEffect(() => {
        subscribeOnce(DepartmentService.getByUserId(userData?.id), (res: Departments[]) => {
            if (res) {
                setDepartments(res);
                setDepartmentDisplays(res);
            }
        });
    }, []);

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
        } else setInitialized(false);
    }, [searchValue]);

    const handleSearchValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickEdit = (department: Departments) => {
        console.log(department);
    };

    const handleClickRemove = (department: Departments) => {
        console.log(department);
    };

    const onClickAdd = () => {
        console.log('Add');
    };

    return (
        <div className="mb-[30px]">
            <div className="text-[24px]">Manage Departments</div>
            <div className="text-[16px] mb-4">Set up all departments that your organization conduct business from.</div>
            <div className="toolbar bg-[#f4f4f4] shadow-md rounded-t-md border w-full p-[16px] flex items-center justify-between">
                <TextField
                    variant="outlined"
                    label="Search"
                    size="small"
                    placeholder="Enter name or location"
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
                <TableContainer sx={{ maxHeight: 546 }}>
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
        </div>
    );
}

export default DepartmentManagement;
