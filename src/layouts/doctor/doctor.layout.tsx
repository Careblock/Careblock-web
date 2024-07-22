import { Outlet } from 'react-router-dom';
import HeaderDoctor from '../header/header-doctor.layout';
import Footer from '../footer/footer.layout';

const DoctorLayout = () => {
    return (
        <main className="min-h-screen flex flex-col">
            <HeaderDoctor />
            <div className="flex-1 pt-[10px] pb-[20px] px-[24px]">
                <Outlet />
            </div>
            <Footer />
        </main>
    );
};

export default DoctorLayout;
