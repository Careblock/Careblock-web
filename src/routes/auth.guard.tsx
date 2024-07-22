import { Navigate, Outlet } from 'react-router-dom';
import { ProtectedRouteProps } from '../types/route.type';
import { AuthContextType } from '../types/auth.type';
import { useAuth } from '../contexts/auth.context';
import { PATHS } from '../enums/RoutePath';
import { ROLES } from '../enums/Common';

export const ProtectedRoute = ({
    allowedRoles = [ROLES.ADMIN, ROLES.PATIENT, ROLES.DOCTOR, ROLES.DOCTOR_MANAGER],
}: ProtectedRouteProps) => {
    const { userData } = useAuth() as AuthContextType;

    if (!userData) {
        return <Navigate to={PATHS.HOME} replace />;
    }

    if (allowedRoles && !allowedRoles.toString().includes(userData.role)) {
        return <Navigate to={PATHS.HOME} replace />;
    }

    return <Outlet />;
};
