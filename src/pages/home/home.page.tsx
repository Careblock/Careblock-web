import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearAppointment, storeAppointment } from '@/stores/appointment/appointment.action';
import { CarouselDataSource } from '@/components/base/carousel/carousel.type';
import { Organizations } from '@/types/organization.type';
import Carousel from '@/components/base/carousel/carousel.component';
import OrganizationService from '@/services/organization.service';
import useObservable from '@/hooks/use-observable.hook';
import { PATHS } from '@/enums/RoutePath';

const Homepage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subscribeOnce } = useObservable();
    const [carouselDatasource, setCarouselDatasource] = useState<CarouselDataSource[]>([]);

    useEffect(() => {
        dispatch(clearAppointment() as any);

        subscribeOnce(OrganizationService.getAllOrganization(), (res: Organizations[]) => {
            const data = res;
            if (data) {
                if (data) {
                    let temp: CarouselDataSource[] = [];
                    data.forEach((org) => {
                        temp.push({
                            id: org.id,
                            avatar: org.avatar ?? '',
                            title: `${org.name} Hospital`,
                        });
                    });
                    setCarouselDatasource(temp);
                }
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
        <Carousel
            title="Health facilities"
            dataSource={carouselDatasource}
            onClickSeeMore={moveToAppointmentPage}
            onClickItem={handleClickItemCarousel}
        />
    );
};

export default Homepage;
