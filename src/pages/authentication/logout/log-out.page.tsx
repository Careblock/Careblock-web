import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/base/loading/loading.component';
import { AuthContextType } from '@/types/auth.type';
import { useAuth } from '@/contexts/auth.context';
import { PATHS } from '@/enums/RoutePath';
import { useWallet } from '@meshsdk/react';

const Logout = () => {
    const navigate = useNavigate();
    const { disconnect } = useWallet();
    const { endSession, userData } = useAuth() as AuthContextType;

    useEffect(() => {
        if (userData) {
            endSession();
            disconnect();
        } else {
            navigate(PATHS.DEFAULT, { replace: true });
        }
    }, [endSession, navigate, userData]);

    return <Loading />;
};

export default Logout;
