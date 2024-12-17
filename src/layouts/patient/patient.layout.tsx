import { Outlet } from 'react-router-dom';
import Footer from '../footer/footer.layout';
import PatientSidebar from '../sidebar/patient-sidebar.component';
import HeaderLayout from '../header/header.layout';

function PatientLayout() {
    return (
        <main className="min-h-screen flex flex-col h-fit">
            <HeaderLayout />
            <div className="flex flex-1 w-full overflow-hidden">
                <div>
                    <PatientSidebar />
                </div>
                <div className="flex-1 pt-[10px] pb-[20px] px-[24px]">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default PatientLayout;
