import { Outlet } from 'react-router-dom';
import ManagerSidebar from '../sidebar/manager-sidebar.component';
import HeaderLayout from '../header/header.layout';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/stores/global.store';

function DoctorManagerLayout() {
    const collapsed = useSelector((state: GlobalState) => state.system.collapsed);

    return (
        <main className="min-h-screen flex flex-col h-fit">
            <HeaderLayout />
            <div className="flex flex-1 w-full overflow-hidden">
                <div>
                    <ManagerSidebar />
                </div>
                <div
                    className={`flex-1 pt-[10px] pb-[20px] px-[24px] duration-200 ${collapsed ? 'ml-[70px]' : 'ml-[200px]'}`}
                >
                    <Outlet />
                </div>
            </div>
        </main>
    );
}

export default DoctorManagerLayout;
