import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthContextType } from '@/types/auth.type';
import { useAuth } from '@/contexts/auth.context';
import {
    routesForDoctor,
    routesForDoctorManager,
    routesForNotAuthenticatedOnly,
    routesForPatient,
    routesForPublic,
} from './index.route';
import Loading from '@/components/base/loading/loading.component';
import DefaultLayout from '../layouts/default/default.layout';
import NotFoundPage from '../pages/error/notfound.page';
import DoctorLayout from '@/layouts/doctor/doctor.layout';
import PatientLayout from '@/layouts/patient/patient.layout';
import DoctorManagerLayout from '@/layouts/doctor-manager/doctor-manager.layout';

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
    ]);

    return <RouterProvider router={router} />;
};

export default Routes;
