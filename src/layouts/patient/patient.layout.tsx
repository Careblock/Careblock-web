import { Outlet } from 'react-router-dom';
import Footer from '../footer/footer.layout';
import Navbar from '../navbar/navbar.layout';

function PatientLayout() {
    return (
        <main className="min-h-screen flex flex-col h-fit">
            <Navbar />
            <div className="flex flex-1 w-full overflow-hidden">
                <div className="flex-1 py-[10px] px-[24px]">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default PatientLayout;
