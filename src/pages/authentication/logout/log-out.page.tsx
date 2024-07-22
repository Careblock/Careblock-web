import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/base/loading/loading.component';
import { AuthContextType } from '@/types/auth.type';
import { useAuth } from '@/contexts/auth.context';
import { PATHS } from '@/enums/RoutePath';

const Logout = () => {
    const navigate = useNavigate();
    const { endSession, userData } = useAuth() as AuthContextType;

    useEffect(() => {
        userData ? endSession() : navigate(PATHS.DEFAULT, { replace: true });
    }, [endSession, navigate, userData]);

    return <Loading />;
};

export default Logout;
