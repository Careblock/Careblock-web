import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/navbar.layout';
import Footer from '../footer/footer.layout';
import { useAuth } from '@/contexts/auth.context';
import { AuthContextType } from '@/types/auth.type';
import { ROLE_NAMES } from '@/enums/Common';
import HeaderLayout from '../header/header.layout';

const DefaultLayout = () => {
    const { userData } = useAuth() as AuthContextType;

    return (
        <main className="min-h-screen flex flex-col">
            {userData?.roles?.includes(ROLE_NAMES.PATIENT) ||
            userData?.roles?.includes(ROLE_NAMES.DOCTOR) ||
            userData?.roles?.includes(ROLE_NAMES.MANAGER) ? (
                <HeaderLayout />
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
