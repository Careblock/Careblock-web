import { useEffect, useState } from 'react';
import 'react-pro-sidebar/dist/css/styles.css';
import { Images } from '@/assets/images';
import { useAuth } from '@/contexts/auth.context';
import { AuthContextType } from '@/types/auth.type';
import { ROLE_NAMES } from '@/enums/Common';
import { sidebarItemAdmins, SidebarItemValue, sidebarItemManagers, SidebarItemType } from './manager-sidebar.const';
import SidebarComponent from './sidebar-item.component';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCollapse } from '@/stores/system/system.action';
import { GlobalState } from '@/stores/global.store';
import { useLocation } from 'react-router-dom';
import { PATHS } from '@/enums/RoutePath';

const ManagerSidebar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const collapsed = useSelector((state: GlobalState) => state.system.collapsed);
    const { userData } = useAuth() as AuthContextType;
    const [activeItem, setActiveItem] = useState<SidebarItemValue>(SidebarItemValue.Organization);
    const [numberUnassigned, setNumberUnassigned] = useState<number>(0);

    useEffect(() => {
        setNumberUnassigned(2);

        if (!userData?.roles.includes(ROLE_NAMES.ADMIN)) {
            handleSetActiveItemManager();
        } else {
            handleSetActiveItemAdmin();
        }
    }, []);

    const handleSetActiveItemManager = () => {
        switch (location.pathname) {
            case PATHS.ORGANIZATION_INFOR:
                setActiveItem(SidebarItemValue.Organization);
                break;
            case PATHS.DEPARTMENT_MANAGEMENT:
                setActiveItem(SidebarItemValue.Departments);
                break;
            case PATHS.TEAM_MEMBERS:
                setActiveItem(SidebarItemValue.Members);
                break;
            case PATHS.INVITE_MEMBERS:
                setActiveItem(SidebarItemValue.Invitation);
                break;
            case PATHS.EXAMINATION_PACKAGE:
                setActiveItem(SidebarItemValue.Packages);
                break;
            case PATHS.MEDICINES:
                setActiveItem(SidebarItemValue.Medicines);
                break;
            case PATHS.SPECIALIST:
                setActiveItem(SidebarItemValue.Specialist);
                break;
            case PATHS.APPOINTMENT_HISTORIES:
                setActiveItem(SidebarItemValue.Appoinments);
                break;
        }
    };

    const handleSetActiveItemAdmin = () => {
        switch (location.pathname) {
            case PATHS.ORGANIZATION_ADMIN:
                setActiveItem(SidebarItemValue.Organization);
                break;
            case PATHS.DEPARTMENT_ADMIN:
                setActiveItem(SidebarItemValue.Departments);
                break;
            case PATHS.SPECIALIST_ADMIN:
                setActiveItem(SidebarItemValue.Specialist);
                break;
            case PATHS.EXAMINATION_TYPE:
                setActiveItem(SidebarItemValue.ExaminationType);
                break;
            case PATHS.EXAMINATION_PACKAGE_ADMIN:
                setActiveItem(SidebarItemValue.Packages);
                break;
            case PATHS.EXAMINATION_OPTIONS_ADMIN:
                setActiveItem(SidebarItemValue.Options);
                break;
            case PATHS.TIME_SLOT_ADMIN:
                setActiveItem(SidebarItemValue.TimeSlot);
                break;
            case PATHS.MEDICINE_TYPE_ADMIN:
                setActiveItem(SidebarItemValue.MedicineType);
                break;
            case PATHS.MEDICINES_ADMIN:
                setActiveItem(SidebarItemValue.Medicines);
                break;
            case PATHS.PAYMENT_METHOD_ADMIN:
                setActiveItem(SidebarItemValue.Payment);
                break;
        }
    };

    const handleToggleCollapse = () => {
        dispatch(toggleCollapse() as any);
    };

    const isActiveItem = (item: SidebarItemValue) => {
        return activeItem === item;
    };

    const handleClickedItem = (item: SidebarItemValue) => {
        setActiveItem(item);
    };

    const getIcon = (value: SidebarItemValue) => {
        switch (value) {
            case SidebarItemValue.Organization:
                return <Images.GrOrganization className={`text-[18px] ${collapsed && 'size-[22px]'}`} />;
            case SidebarItemValue.Departments:
                return <Images.MdMeetingRoom className={`text-[20px] ${collapsed && 'size-[22px]'}`} />;
            case SidebarItemValue.Members:
                return <Images.RiTeamFill className={`text-[20px] ${collapsed && 'size-[22px]'}`} />;
            case SidebarItemValue.Invitation:
                return <Images.TiUserAdd className={`text-[20px] ${collapsed && 'size-[22px]'}`} />;
            case SidebarItemValue.Specialist:
                return <Images.GiMedicines className={`text-[20px] ${collapsed && 'size-[22px]'}`} />;
            case SidebarItemValue.Packages:
                return <Images.BsPersonVcardFill className={`text-[18px] ${collapsed && 'size-[22px]'}`} />;
            case SidebarItemValue.Medicines:
                return <Images.FaBriefcaseMedical className={`text-[18px] ${collapsed && 'size-[22px]'}`} />;
            case SidebarItemValue.Appoinments:
                return (
                    <>
                        <Images.FaHistory className={`text-[18px] ${collapsed && 'size-[22px]'}`} />
                        {!collapsed && (
                            <div className="relative">
                                <p className=" text-[16px]">Appoinments</p>
                                {numberUnassigned > 0 && (
                                    <p className="rounded-full p-[2px] text-[white] bg-[red] min-w-[22px] h-[22px] flex items-center justify-center text-[12px] absolute top-0 right-[-26px]">
                                        {numberUnassigned}
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                );
            case SidebarItemValue.ExaminationType:
                return <Images.FiPackage className={`text-[20px] ${collapsed && 'size-[22px]'}`} />;
            case SidebarItemValue.Options:
                return <Images.TbTableOptions className={`text-[20px] ${collapsed && 'size-[22px]'}`} />;
            case SidebarItemValue.TimeSlot:
                return <Images.RxLapTimer className={`text-[20px] ${collapsed && 'size-[22px]'}`} />;
            case SidebarItemValue.MedicineType:
                return <Images.RiMedicineBottleFill className={`text-[20px] ${collapsed && 'size-[22px]'}`} />;
            case SidebarItemValue.Payment:
                return <Images.MdOutlinePayment className={`text-[20px] ${collapsed && 'size-[22px]'}`} />;
        }
    };

    return (
        <div
            className={`${collapsed ? 'w-[70px]' : 'w-[200px]'} bg-white shadow-xl border-r h-[calc(100vh-52px)] select-none fixed top-[52px] left-0 z-[10] flex flex-col justify-between duration-200`}
        >
            <ul className="bg-white space-y-[4px] py-[10px]">
                {!userData?.roles.includes(ROLE_NAMES.ADMIN) && (
                    <>
                        {sidebarItemManagers.map((item: SidebarItemType) => (
                            <SidebarComponent
                                key={item.itemValue}
                                collapsed={collapsed}
                                itemValue={item.itemValue}
                                label={item.label}
                                path={item.path}
                                isCustom={item.isCustom}
                                isActiveItem={() => isActiveItem(item.itemValue)}
                                handleClickedItem={() => handleClickedItem(item.itemValue)}
                            >
                                {getIcon(item.itemValue)}
                            </SidebarComponent>
                        ))}
                    </>
                )}
                {userData?.roles.includes(ROLE_NAMES.ADMIN) && (
                    <>
                        {sidebarItemAdmins.map((item: SidebarItemType) => (
                            <SidebarComponent
                                key={item.itemValue}
                                collapsed={collapsed}
                                itemValue={item.itemValue}
                                label={item.label}
                                path={item.path}
                                isCustom={item.isCustom}
                                isActiveItem={() => isActiveItem(item.itemValue)}
                                handleClickedItem={() => handleClickedItem(item.itemValue)}
                            >
                                {getIcon(item.itemValue)}
                            </SidebarComponent>
                        ))}
                    </>
                )}
            </ul>
            <div
                className={`h-[50px] border-t border-[#ccc] py-[10px] flex items-center gap-x-[10px] px-[24px] hover:bg-primary text-black hover:text-white cursor-pointer`}
                onClick={() => handleToggleCollapse()}
            >
                {collapsed ? (
                    <Images.TbLayoutSidebarRightCollapseFilled
                        className={`text-[20px] ${collapsed && 'w-full h-full'}`}
                    />
                ) : (
                    <Images.TbLayoutSidebarLeftCollapseFilled
                        className={`text-[20px] ${collapsed && 'w-full h-full'}`}
                    />
                )}
                {!collapsed && <p className=" text-[16px]">Collapse</p>}
            </div>
        </div>
    );
};

export default ManagerSidebar;
