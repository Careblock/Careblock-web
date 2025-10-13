import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import { clearAppointment, storeAppointment } from '@/stores/appointment/appointment.action';
import { CarouselDataSource } from '@/components/base/carousel/carousel.type';
import Carousel from '@/components/base/carousel/carousel.component';
import HomeActions from '@/components/home/HomeActions';
import useObservable from '@/hooks/use-observable.hook';
import { PATHS } from '@/enums/RoutePath';
import { setTitle } from '@/utils/document';
import ExaminationTypeService from '@/services/examinationType.service';
import { ExaminationTypes } from '@/types/examinationType.type';

const Homepage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subscribeOnce } = useObservable();
    const [carouselDatasource, setCarouselDatasource] = useState<CarouselDataSource[]>([]);

    useEffect(() => {
        setTitle('Home | CareBlock');

        dispatch(clearAppointment() as any);

        subscribeOnce(ExaminationTypeService.getAll(), (res: ExaminationTypes[]) => {
            const data = res;
            if (data) {
                let temp: CarouselDataSource[] = [];
                data.forEach((type) => {
                    temp.push({
                        id: `${type.id}`,
                        avatar: type.thumbnail ?? '',
                        title: type.name,
                    });
                });
                setCarouselDatasource(temp);
            }
        });
    }, []);

    const moveToAppointmentPage = () => {
        navigate({
            pathname: PATHS.APPOINTMENT_STEP1,
        });
    };

    const handleClickItemCarousel = (id: string) => {
        dispatch(storeAppointment(id) as any);
        moveToAppointmentPage();
    };

    return (
        <>
            {/* Main Action Cards */}
            <HomeActions />
            
            {/* Health Services Carousel */}
            <Box sx={{ mt: 4 }}>
                <Carousel
                    title="Available Health Services"
                    dataSource={carouselDatasource}
                    onClickSeeMore={moveToAppointmentPage}
                    onClickItem={handleClickItemCarousel}
                />
            </Box>
        </>
    );
};

export default Homepage;
