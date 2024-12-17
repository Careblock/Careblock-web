import { Outlet } from 'react-router-dom';
import Footer from '../footer/footer.layout';
import HeaderLayout from '../header/header.layout';

const DoctorLayout = () => {
    return (
        <main className="min-h-screen flex flex-col">
            <HeaderLayout />
            <div className="flex-1 pt-[10px] pb-[20px] px-[24px]">
                <Outlet />
            </div>
            <Footer />
        </main>
    );
};

export default DoctorLayout;
