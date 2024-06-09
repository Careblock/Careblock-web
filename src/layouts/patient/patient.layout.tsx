import { Outlet } from 'react-router-dom';
import HeaderPatient from '../header/header-patient.layout';
import Footer from '../footer/footer.layout';
import Sidebar from '../sidebar/sidebar.component';

function PatientLayout() {
    return (
        <main className="min-h-screen flex flex-col h-fit">
            <HeaderPatient />
            <div className="flex flex-1 w-full overflow-hidden">
                <div>
                    <Sidebar />
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
