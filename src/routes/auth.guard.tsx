import { Navigate, Outlet } from 'react-router-dom';
import { ProtectedRouteProps } from '../types/route.type';
import { AuthContextType } from '../types/auth.type';
import { useAuth } from '../contexts/auth.context';
import { PATHS } from '../enums/RoutePath';
import { ROLE_NAMES } from '../enums/Common';

export const ProtectedRoute = ({
    allowedRoles = [
        ROLE_NAMES.ADMIN,
        ROLE_NAMES.PATIENT,
        ROLE_NAMES.DOCTOR,
        ROLE_NAMES.MANAGER,
    ],
}: ProtectedRouteProps) => {
    const { userData } = useAuth() as AuthContextType;
    let isValid = true;

    if (!userData) {
        return <Navigate to={PATHS.HOME} replace />;
    }

    allowedRoles.forEach((roles) => {
        if (!userData.roles?.includes(roles) && !userData.roles?.includes(ROLE_NAMES.MANAGER_SIGN)) {
            isValid = false;
            return <Navigate to={PATHS.FORBIDDEN} replace />;
        }
    });

    if (isValid) return <Outlet />;
    return <Navigate to={PATHS.FORBIDDEN} replace />;
};
