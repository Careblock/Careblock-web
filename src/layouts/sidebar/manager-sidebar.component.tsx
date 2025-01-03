import { Menu, MenuItem, ProSidebar, SidebarContent, SidebarHeader } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import 'react-pro-sidebar/dist/css/styles.css';
import { Images } from '@/assets/images';
import { PATHS } from '@/enums/RoutePath';
import { useAuth } from '@/contexts/auth.context';
import { AuthContextType } from '@/types/auth.type';
import { ROLE_NAMES } from '@/enums/Common';

const ManagerSidebar = () => {
    const { userData } = useAuth() as AuthContextType;
    const [collapsed, setCollapsed] = useState(false);

    return (
        <ProSidebar
            collapsed={collapsed}
            collapsedWidth={'70px'}
            width={260}
            className="bg-white shadow-xl min-h-[calc(100vh-96px)] select-none"
        >
            <SidebarHeader style={{ backgroundColor: 'white' }}>
                <div className="py-1 px-[24px] flex justify-between items-center uppercase font-bold">
                    {!collapsed && <span className="text-[20px] text-blue-gray-500">MENU</span>}
                    <span
                        className="items-center py-[10px] px-[2px] cursor-pointer"
                        onClick={() => {
                            setCollapsed(!collapsed);
                        }}
                    >
                        <Images.FaBars className="cursor-pointer text-blue-gray-500" size={20} />
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent style={{ backgroundColor: 'white' }}>
                {!userData?.roles.includes(ROLE_NAMES.ADMIN) && (
                    <>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.GrOrganization />}>
                                <span className="text-black text-[16px]">Organization Infor</span>
                                <Link to={PATHS.ORGANIZATION_INFOR} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.MdMeetingRoom />}>
                                <span className="text-black text-[16px]">Departments</span>
                                <Link to={PATHS.DEPARTMENT_MANAGEMENT} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.RiTeamFill />}>
                                <span className="text-black text-[16px]">Team members</span>
                                <Link to={PATHS.TEAM_MEMBERS} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.TiUserAdd />}>
                                <span className="text-black text-[16px]">Invitation</span>
                                <Link to={PATHS.INVITE_MEMBERS} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.BsPersonVcardFill />}>
                                <span className="text-black text-[16px]">Specialist</span>
                                <Link to={PATHS.SPECIALIST} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.FaBriefcaseMedical />}>
                                <span className="text-black text-[16px]">Examination Package</span>
                                <Link to={PATHS.EXAMINATION_PACKAGE} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.GiMedicines />}>
                                <span className="text-black text-[16px]">Medicines</span>
                                <Link to={PATHS.MEDICINES} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.FaHistory />}>
                                <span className="text-black text-[16px]">Appoinment histories</span>
                                <Link to={PATHS.APPOINTMENT_HISTORIES} />
                            </MenuItem>
                        </Menu>
                    </>
                )}
                {userData?.roles.includes(ROLE_NAMES.ADMIN) && (
                    <>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.GrOrganization />}>
                                <span className="text-black text-[16px]">Organizations</span>
                                <Link to={PATHS.ORGANIZATION_ADMIN} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.MdMeetingRoom />}>
                                <span className="text-black text-[16px]">Departments</span>
                                <Link to={PATHS.DEPARTMENT_ADMIN} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.BsPersonVcardFill />}>
                                <span className="text-black text-[16px]">Specialist</span>
                                <Link to={PATHS.SPECIALIST_ADMIN} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.FiPackage />}>
                                <span className="text-black text-[16px]">Examination Type</span>
                                <Link to={PATHS.EXAMINATION_TYPE} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.FaBriefcaseMedical />}>
                                <span className="text-black text-[16px]">Examination Package</span>
                                <Link to={PATHS.EXAMINATION_PACKAGE_ADMIN} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.TbTableOptions />}>
                                <span className="text-black text-[16px]">Examination Options</span>
                                <Link to={PATHS.EXAMINATION_OPTIONS_ADMIN} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.RxLapTimer />}>
                                <span className="text-black text-[16px]">Time slot</span>
                                <Link to={PATHS.TIME_SLOT_ADMIN} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.RiMedicineBottleFill />}>
                                <span className="text-black text-[16px]">Medicine Type</span>
                                <Link to={PATHS.MEDICINE_TYPE_ADMIN} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.GiMedicines />}>
                                <span className="text-black text-[16px]">Medicines</span>
                                <Link to={PATHS.MEDICINES_ADMIN} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0">
                            <MenuItem icon={<Images.MdOutlinePayment />}>
                                <span className="text-black text-[16px]">Payment Method</span>
                                <Link to={PATHS.PAYMENT_METHOD_ADMIN} />
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </SidebarContent>
        </ProSidebar>
    );
};

export default ManagerSidebar;
