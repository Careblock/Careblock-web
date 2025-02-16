import { useEffect, useState } from 'react';
import useObservable from '@/hooks/use-observable.hook';
import HttpService from '@/services/http/http.service';
import './loading.style.scss';

const Loading = ({ isLoading }: { isLoading?: boolean }) => {
    const [isShow, setIsShow] = useState(false);

    const { subscribeUntilDestroy } = useObservable();

    useEffect(() => {
        subscribeUntilDestroy(HttpService.isRequesting$, (isRequesting) => {
            if (isRequesting) {
                setIsShow(true);
            } else {
                setIsShow(false);
            }
        });
    }, []);

    useEffect(() => {
        setIsShow(!!isLoading);
    }, [isLoading]);

    useEffect(() => {
        if (isShow) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isShow]);

    return (
        <div
            className={`base-loading-container fixed top-0 left-0 flex items-center justify-center w-screen h-screen ${isShow ? '' : 'hidden'}`}
        >
            <div className="base-loading text-[30px] font-bold overflow-hidden whitespace-nowrap"></div>
        </div>
    );
};

export default Loading;
