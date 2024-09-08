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

    if (!userData) {
        return <Navigate to={PATHS.HOME} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userData.role)) {
        return <Navigate to={PATHS.HOME} replace />;
    }

    return <Outlet />;
};
