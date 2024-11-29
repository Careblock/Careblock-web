import { Menu, MenuItem, ProSidebar, SidebarContent, SidebarHeader } from 'react-pro-sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import 'react-pro-sidebar/dist/css/styles.css';
import { Images } from '@/assets/images';
import { PATHS } from '@/enums/RoutePath';
import { useAuth } from '@/contexts/auth.context';
import { AuthContextType } from '@/types/auth.type';
import { ROLE_NAMES } from '@/enums/Common';

const ManagerSidebar = () => {
    const navigate = useNavigate();
    const { userData } = useAuth() as AuthContextType;
    const [collapsed, setCollapsed] = useState(false);

    return (
        <ProSidebar
            collapsed={collapsed}
            collapsedWidth={'70px'}
            className="bg-white shadow-xl min-h-[calc(100vh-104px)] select-none"
        >
            <SidebarHeader style={{ backgroundColor: 'white' }}>
                <div className="py-1 px-5 flex justify-between items-center text-uppercase font-bold text-lg space-beetween">
                    {!collapsed && (
                        <span
                            className="text-2xl cursor-pointer text-blue-gray-500"
                            onClick={() => navigate('/patient')}
                        >
                            MENU
                        </span>
                    )}
                    <span
                        className="items-center text-4xl p-3"
                        onClick={() => {
                            setCollapsed(!collapsed);
                        }}
                    >
                        <Images.FaBars className="cursor-pointer text-5xl text-black" size={20} />
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent style={{ backgroundColor: 'white' }}>
                {!userData?.roles.includes(ROLE_NAMES.ADMIN) && (
                    <>
                        <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                            <MenuItem icon={<Images.MdDashboard />}>
                                <span className="text-black text-xl">Dashboard</span>
                                <Link to={PATHS.ORGANIZATION_INFOR} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                            <MenuItem icon={<Images.GrOrganization />}>
                                <span className="text-black text-xl">Organization Infor</span>
                                <Link to={PATHS.ORGANIZATION_INFOR} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                            <MenuItem icon={<Images.MdMeetingRoom />}>
                                <span className="text-black text-xl">Departments</span>
                                <Link to={PATHS.DEPARTMENT_MANAGEMENT} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                            <MenuItem icon={<Images.RiTeamFill />}>
                                <span className="text-black text-xl">Team members</span>
                                <Link to={PATHS.TEAM_MEMBERS} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                            <MenuItem icon={<Images.TiUserAdd />}>
                                <span className="text-black text-xl">Invitation</span>
                                <Link to={PATHS.INVITE_MEMBERS} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                            <MenuItem icon={<Images.BsPersonVcardFill />}>
                                <span className="text-black text-xl">Specialist</span>
                                <Link to={PATHS.SPECIALIST} />
                            </MenuItem>
                        </Menu>
                    </>
                )}
                <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                    <MenuItem icon={<Images.FiPackage />}>
                        <span className="text-black text-xl">Examination Type</span>
                        <Link to={PATHS.EXAMINATION_TYPE} />
                    </MenuItem>
                </Menu>
                {!userData?.roles.includes(ROLE_NAMES.ADMIN) && (
                    <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                        <MenuItem icon={<Images.FaBriefcaseMedical />}>
                            <span className="text-black text-xl">Examination Package</span>
                            <Link to={PATHS.EXAMINATION_PACKAGE} />
                        </MenuItem>
                    </Menu>
                )}
                <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                    <MenuItem icon={<Images.RiMedicineBottleFill />}>
                        <span className="text-black text-xl">Medicine Type</span>
                        <Link to={PATHS.MEDICINE_TYPE} />
                    </MenuItem>
                </Menu>
                {!userData?.roles.includes(ROLE_NAMES.ADMIN) && (
                    <>
                        <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                            <MenuItem icon={<Images.GiMedicines />}>
                                <span className="text-black text-xl">Medicines</span>
                                <Link to={PATHS.MEDICINES} />
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                            <MenuItem icon={<Images.FaHistory />}>
                                <span className="text-black text-xl">Appoinment histories</span>
                                <Link to={PATHS.APPOINTMENT_HISTORIES} />
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </SidebarContent>
        </ProSidebar>
    );
};

export default ManagerSidebar;
