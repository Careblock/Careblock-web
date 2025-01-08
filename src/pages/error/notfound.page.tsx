import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Images } from '../../assets/images';
import { PATHS } from '../../enums/RoutePath';
import { useEffect, useState } from 'react';
import { setTitle } from '../../utils/document';
import { Dialog, DialogTitle, List, ListItem } from '@mui/material';
import { Login } from '../authentication/login/login.page';
import { useAuth } from '@/contexts/auth.context';
import { AuthContextType } from '@/types/auth.type';

const NotFoundPage = () => {
    const { userData } = useAuth() as AuthContextType;
    const [openLoginForm, setOpenLoginForm] = useState(false);

    useEffect(() => {
        setTitle('Page not found | CareBlock');
        setOpenLoginForm(true);
    }, []);

    const handleClose = () => {
        setOpenLoginForm(false);
    };

    const SimpleDialog = (_: any) => {
        return (
            <Dialog className="bg-blue-gray-300" open={openLoginForm} onClose={handleClose}>
                <DialogTitle></DialogTitle>
                <List style={{ width: '500px', height: '300px' }} className="rounded-xl">
                    <ListItem>
                        <Login handleClose={handleClose} />
                    </ListItem>
                </List>
            </Dialog>
        );
    };

    return (
        <>
            {userData?.id ? (
                <div className="w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-indigo-100">
                    <div className="w-[400px] h-[220px] flex items-center justify-center overflow-hidden">
                        <img src={Images.PageNotFound} alt="Page not found" className="w-full object-contain" />
                    </div>
                    <div className="mt-3 mb-8 text-center">
                        <p className="text-[20px] text-[red] font-bold">Page Not Found!</p>
                        <p className="text-[16px]">
                            Unfortunately we're having trouble loading the page you are looking for.
                        </p>
                    </div>
                    <Link to={PATHS.DEFAULT}>
                        <Button variant="contained">Back to home</Button>
                    </Link>
                </div>
            ) : (
                <SimpleDialog open={openLoginForm} onClose={handleClose} />
            )}
        </>
    );
};

export default NotFoundPage;
