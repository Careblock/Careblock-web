import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/navbar.layout';
import Footer from '../footer/footer.layout';

const DefaultLayout = () => {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
                <div className="pt-[10px] pb-[20px] px-[24px]">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default DefaultLayout;
