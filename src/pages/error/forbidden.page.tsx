import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Images } from '../../assets/images';
import { PATHS } from '../../enums/RoutePath';
import { useEffect } from 'react';
import { setTitle } from '../../utils/document';

const Forbidden = () => {
    useEffect(() => {
        setTitle('Access denied | CareBlock');
    }, []);

    return (
        <div className="w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-indigo-100">
            <div className="w-[400px] h-auto flex items-center justify-center overflow-hidden">
                <img src={Images.Forbidden} alt="Access denied" className="w-full object-contain" />
            </div>
            <div className="mt-3 mb-8 text-center">
                <p className="text-[20px] text-[red] font-bold">Access denied!</p>
                <p className="text-[16px]">You don't have permission to access this page.</p>
            </div>
            <Link to={PATHS.DEFAULT}>
                <Button variant="contained">Back to home</Button>
            </Link>
        </div>
    );
};

export default Forbidden;
