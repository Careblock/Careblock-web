import { Outlet } from 'react-router-dom';
import Footer from '../footer/footer.layout';
import ManagerSidebar from '../sidebar/manager-sidebar.component';
import HeaderDoctor from '../header/header-doctor.layout';

function DoctorManagerLayout() {
    return (
        <main className="min-h-screen flex flex-col h-fit">
            <HeaderDoctor />
            <div className="flex flex-1 w-full overflow-hidden">
                <div>
                    <ManagerSidebar />
                </div>
                <div className="flex-1 pt-[10px] pb-[20px] px-[24px]">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default DoctorManagerLayout;
