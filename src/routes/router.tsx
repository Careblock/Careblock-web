import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthContextType } from '@/types/auth.type';
import { useAuth } from '@/contexts/auth.context';
import {
    routesForAdmin,
    routesForDoctor,
    routesForDoctorManager,
    routesForNotAuthenticatedOnly,
    routesForPatient,
    routesForPublic,
} from './index.route';
import Loading from '@/components/base/loading/loading.component';
import DefaultLayout from '../layouts/default/default.layout';
import NotFoundPage from '../pages/error/notfound.page';
import Forbidden from '@/pages/error/forbidden.page';
import DoctorLayout from '@/layouts/doctor/doctor.layout';
import PatientLayout from '@/layouts/patient/patient.layout';
import DoctorManagerLayout from '@/layouts/doctor-manager/doctor-manager.layout';
import { PATHS } from '@/enums/RoutePath';

const Routes = () => {
    const { userData, isLoading } = useAuth() as AuthContextType;

    if (isLoading) {
        return <Loading />;
    }

    const router = createBrowserRouter([
        {
            element: <DefaultLayout />,
            errorElement: <NotFoundPage />,
            children: [...(!userData ? routesForNotAuthenticatedOnly : []), ...routesForPublic],
        },
        {
            path: PATHS.FORBIDDEN,
            element: <Forbidden />,
            errorElement: <NotFoundPage />,
        },
        {
            element: <DoctorLayout />,
            errorElement: <NotFoundPage />,
            children: [...routesForDoctor],
        },
        {
            element: <PatientLayout />,
            errorElement: <NotFoundPage />,
            children: [...routesForPatient],
        },
        {
            element: <DoctorManagerLayout />,
            errorElement: <NotFoundPage />,
            children: [...routesForDoctorManager],
        },
        {
            element: <DoctorManagerLayout />,
            errorElement: <NotFoundPage />,
            children: [...routesForAdmin],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default Routes;
