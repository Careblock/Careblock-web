import { Navigate, Outlet } from 'react-router-dom';
import { ProtectedRouteProps } from '../types/route.type';
import { AuthContextType } from '../types/auth.type';
import { useAuth } from '../contexts/auth.context';
import { PATHS } from '../enums/RoutePath';
import { ROLE_NAMES } from '../enums/Common';

export const ProtectedRoute = ({
    allowedRoles = [ROLE_NAMES.ADMIN, ROLE_NAMES.PATIENT, ROLE_NAMES.DOCTOR, ROLE_NAMES.MANAGER],
}: ProtectedRouteProps) => {
    const { userData } = useAuth() as AuthContextType;
    let isValid = true;

    if (!userData) {
        return <Navigate to={PATHS.HOME} replace />;
    }

    const userRoles = userData.roles?.split(',');

    allowedRoles.forEach((roles) => {
        if (!userRoles?.includes(roles)) {
            isValid = false;
            return <Navigate to={PATHS.NOTFOUND} replace />;
        }
    });

    if (isValid) return <Outlet />;
    else return <Navigate to={PATHS.NOTFOUND} replace />;
};
