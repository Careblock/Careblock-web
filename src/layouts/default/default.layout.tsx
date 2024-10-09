import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar.layout';
import Footer from '../footer/footer.layout';
import { useAuth } from '@/contexts/auth.context';
import { AuthContextType } from '@/types/auth.type';
import HeaderPatient from '../header/header-patient.layout';
import { ROLE_NAMES } from '@/enums/Common';
import HeaderDoctor from '../header/header-doctor.layout';
import HeaderDoctorManager from '../header/header-doctor-manager.layout';
import { useEffect } from 'react';
import useObservable from '@/hooks/use-observable.hook';
import AuthService from '@/services/auth.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { storeUser } from '@/stores/auth/auth.action';
import { setTitle } from '@/utils/document';
import { PATHS } from '@/enums/RoutePath';
import { CookieManager } from '@/utils/cookie';

const DefaultLayout = () => {
    const { userData, startSession } = useAuth() as AuthContextType;
    const { subscribeOnce } = useObservable();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { getCookie } = CookieManager();

    useEffect(() => {
        try {
            subscribeOnce(AuthService.authenticate(getCookie('stakeId')[0]), (res: any) => {
                const { jwtToken, ...rest } = res;
                const roles = (jwtDecode<JwtPayload>(jwtToken) as any)?.roles?.split(',');
                startSession({ accessToken: res.jwtToken, user: { ...rest, roles } });
                dispatch(storeUser(res) as any);
                if (roles.includes(ROLE_NAMES.PATIENT)) {
                    setTitle('Home | CareBlock');
                    navigate(PATHS.DEFAULT);
                } else if (roles.includes(ROLE_NAMES.DOCTOR)) {
                    setTitle('Doctor schedule | CareBlock');
                    navigate(PATHS.DOCTOR_SCHEDULE);
                } else if (roles.includes(ROLE_NAMES.MANAGER)) {
                    setTitle('Doctor Manager | CareBlock');
                    navigate(PATHS.ORGANIZATION_INFOR);
                } else {
                    setTitle('Home | CareBlock');
                    navigate(PATHS.HOME);
                }
            });
        } catch (err: any) {
            setTitle('Home | CareBlock');
            navigate(PATHS.HOME);
        }
    }, []);

    return (
        <main className="min-h-screen flex flex-col">
            {userData?.roles?.includes(ROLE_NAMES.PATIENT) ? (
                <HeaderPatient />
            ) : userData?.roles?.includes(ROLE_NAMES.DOCTOR) ? (
                <HeaderDoctor />
            ) : userData?.roles?.includes(ROLE_NAMES.MANAGER) ? (
                <HeaderDoctorManager />
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
