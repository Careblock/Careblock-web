import { Menu, MenuItem, ProSidebar, SidebarContent, SidebarHeader } from 'react-pro-sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import 'react-pro-sidebar/dist/css/styles.css';
import { Images } from '@/assets/images';
import { PATHS } from '@/enums/RoutePath';

const PatientSidebar = () => {
    const navigate = useNavigate();
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
                <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                    <MenuItem icon={<Images.MdDashboard />}>
                        <span className="text-black text-xl">Dashboard</span>
                        <Link to={PATHS.PATIENT_PAGE} />
                    </MenuItem>
                </Menu>
                <Menu iconShape="circle" className="!p-0 hover:bg-gray">
                    <MenuItem icon={<Images.HistoryIcon />}>
                        <span className="text-black text-xl">Appointments History</span>
                        <Link to={PATHS.PATIENT_APPOINTMENT_HISTORY} />
                    </MenuItem>
                </Menu>
            </SidebarContent>
        </ProSidebar>
    );
};

export default PatientSidebar;
