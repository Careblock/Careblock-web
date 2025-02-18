import { useEffect, useState } from 'react';
import useObservable from '@/hooks/use-observable.hook';
import { setTitle } from '@/utils/document';
import {
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
import { columns } from './permissions.const';
import { getNotNullString } from '@/utils/string.helper';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/stores/global.store';
import { Doctors } from '@/types/doctor.type';
import AccountService from '@/services/account.service';
import { ROLE_NAMES } from '@/enums/Common';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { Column } from './permissions.type';
import { getFullName } from '@/utils/common.helpers';
import { StyledTableCell } from '@/constants/common.const';
import Nodata from '@/components/base/no-data/nodata.component';
import OrganizationService from '@/services/organization.service';
import { Organizations } from '@/types/organization.type';
import PopupConfirm from '@/components/base/popup/popup-confirm.component';
import { SystemMessage } from '@/constants/message.const';
import { ToastPositionEnum } from '@/components/base/toast/toast.type';
import { addToast } from '@/components/base/toast/toast.service';

function PermissionsPage() {
    const { subscribeOnce } = useObservable();
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [managerId, setManagerId] = useState<string>();
    const [managers, setManagers] = useState<any[]>([]);
    const [organizationId, setOrganizationId] = useState<string>('');
    const [organizations, setOrganizations] = useState<Organizations[]>([]);
    const [managersDisplays, setManagersDisplays] = useState<any[]>([]);
    const collapsed = useSelector((state: GlobalState) => state.system.collapsed);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);

    useEffect(() => {
        setTitle('Permissions | CareBlock');

        getOrganizations();
    }, []);

    useEffect(() => {
        if (!initialized) {
            let result = managers.filter((person: Doctors) => {
                if (
                    person.firstname.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    person.lastname?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    person.phone?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    person.email?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())
                ) {
                    return person;
                }
            });
            setManagersDisplays(result);
            setPage(0);
        } else setInitialized(false);
    }, [searchValue]);

    useEffect(() => {
        if (organizationId) {
            getDatasource(organizationId);
        }
    }, [organizationId]);

    const getOrganizations = () => {
        subscribeOnce(OrganizationService.getAllOrganization(), (res: any) => {
            setOrganizations(res.map((data: any) => ({ name: data.name, organizationId: data.id })));
            const firstId = res[0].id;
            setOrganizationId(firstId);
            getDatasource(firstId);
        });
    };

    const getDatasource = (organizationId: string) => {
        if (organizationId) {
            subscribeOnce(AccountService.getManagersOrg(organizationId), (res: Doctors[]) => {
                if (res) {
                    setManagers(res);
                    setManagersDisplays(res);
                }
            });
        }
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

    const onClickGrant = (manager: Doctors) => {
        setManagerId(manager.id);

        const hasSignRole = managers.some((manager: any) => manager.roles.includes(ROLE_NAMES.MANAGER_SIGN));
        if (hasSignRole) {
            setIsVisiblePopupConfirm(true);
        } else {
            handleConfirmGrant();
        }
    };

    const getCellElement = (person: Doctors, column: Column, value: any) => {
        if (column.id === 'avatar') {
            return (
                <img
                    src={getNotNullString(value as string, avatarDefault)}
                    alt="Thumbnail"
                    className="size-[50px] object-cover rounded-full"
                />
            );
        }
        if (column.id === 'firstname') {
            return getFullName(person);
        }
        if (column.id === 'roles') {
            return (
                <div className="flex flex-col gap-y-[4px]">
                    {person.roles!.includes(ROLE_NAMES.MANAGER) && (
                        <div className="text-center text-white bg-[#672bff] py-[2px] px-[10px] rounded-full select-none">
                            Manager
                        </div>
                    )}
                    {person.roles!.includes(ROLE_NAMES.MANAGER_SIGN) && (
                        <div className="text-center text-white bg-[#df2bff] py-[2px] px-[10px] rounded-full select-none">
                            Manager Sign
                        </div>
                    )}
                    {person.roles!.includes(ROLE_NAMES.DOCTOR) && (
                        <div className="text-center text-white bg-[#1976d2] py-[2px] px-[10px] rounded-full select-none">
                            Doctor
                        </div>
                    )}
                </div>
            );
        }
        if (column.format && typeof value === 'number') {
            return column.format(value);
        }
        return value;
    };

    const handleClosePopupConfirm = () => {
        setIsVisiblePopupConfirm(false);
    };

    const handleConfirmGrant = () => {
        if (!managerId) return;

        const signManager = managers.find((manager: any) => manager.roles.includes(ROLE_NAMES.MANAGER_SIGN));

        subscribeOnce(
            AccountService.grantSignPermission(managerId, signManager ? signManager.id : undefined),
            (res: boolean) => {
                if (res) {
                    setPage(0);
                    getDatasource(organizationId);
                    setIsVisiblePopupConfirm(false);
                    addToast({ text: SystemMessage.GRANT_SIGN_ROLE, position: ToastPositionEnum.TopRight });
                }
            }
        );
    };

    return (
        <>
            <div className={`h-full w-[calc(100vw-${collapsed ? '70px' : '200px'}-40px)]`}>
                <div className="text-[20px] leading-[20px] font-bold">Grant permission to managers</div>
                <div className="text-[16px] mb-[10px]">Add manage managers's details & their permissions.</div>
                <div className="toolbar bg-[#f4f4f4] shadow-md rounded-t-md border w-full p-[16px] flex items-center gap-x-[16px]">
                    <TextField
                        variant="outlined"
                        label="Search"
                        size="medium"
                        helperText="Enter name, phone number or email"
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
                    <div className="flex flex-col ml-[20px] w-[300px]">
                        <Select
                            className="w-full"
                            size="medium"
                            value={organizationId}
                            onChange={($event: any) => setOrganizationId($event.target.value)}
                        >
                            {organizations.map((item: any) => (
                                <MenuItem key={item.organizationId} value={item.organizationId}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            <span className="block mt-[2px] mx-[14px]">Choose an organization</span>
                        </FormHelperText>
                    </div>
                </div>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer className="max-h-[calc(100vh-52px-30px-110px-20px-34px-54px)]">
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
                                {managersDisplays.length ? (
                                    managersDisplays
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((person: Doctors) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={person.id}>
                                                    {columns.map((column) => {
                                                        const value = person[column.id];
                                                        return (
                                                            <StyledTableCell key={column.id} align={column.align}>
                                                                {getCellElement(person, column, value)}
                                                            </StyledTableCell>
                                                        );
                                                    })}
                                                    <StyledTableCell key="action" align="center">
                                                        <div className="flex items-center justify-center gap-x-[16px] border-[#d6d6d6] w-full">
                                                            {!person.roles?.includes(ROLE_NAMES.MANAGER_SIGN) ? (
                                                                <Images.FaFileSignature
                                                                    className="text-[36px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[black]"
                                                                    title="Grant sign permission"
                                                                    onClick={() => onClickGrant(person)}
                                                                />
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </div>
                                                    </StyledTableCell>
                                                </TableRow>
                                            );
                                        })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <div className="w-full flex items-center justify-center">
                                                <div className="w-[200px]">
                                                    <Nodata />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        className="border-t bg-[#f4f4f4]"
                        count={managersDisplays.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>

            <PopupConfirm
                isVisible={isVisiblePopupConfirm}
                onClickCancel={handleClosePopupConfirm}
                onClickConfirm={() => handleConfirmGrant()}
            />
        </>
    );
}

export default PermissionsPage;
