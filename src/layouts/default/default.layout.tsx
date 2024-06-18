import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/navbar.layout';
import Footer from '../footer/footer.layout';
import { useAuth } from '@/contexts/auth.context';
import { AuthContextType } from '@/types/auth.type';
import HeaderPatient from '../header/header-patient.layout';
import { ROLES } from '@/enums/Common';
import HeaderDoctor from '../header/header-doctor.layout';

const DefaultLayout = () => {
    const { userData } = useAuth() as AuthContextType;

    return (
        <main className="min-h-screen flex flex-col">
            {userData && userData.role == ROLES.PATIENT ? (
                <HeaderPatient />
            ) : userData && userData.role == ROLES.DOCTOR ? (
                <HeaderDoctor />
            ) : (
                <Navbar />
            )}
            <div className="flex-1">
                <div className="pt-[10px] pb-[20px] px-[24px]">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default DefaultLayout;
