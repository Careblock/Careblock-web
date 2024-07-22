import { useEffect, useState } from 'react';
import { CarouselProps } from './carousel.type';
import CarouselItem from './carousel-item';
import { Images } from '@/assets/images';
import { Button } from '@mui/material';

const DISPLAY_NUMBER = 5;

const Carousel = ({ title, buttonText, dataSource, onClickSeeMore, onClickItem }: CarouselProps) => {
    const [pageIndex, setPageIndex] = useState(1);

    const [data, setData] = useState(() => {
        return dataSource.filter((data, index) => {
            if (index < DISPLAY_NUMBER) return data;
        });
    });

    useEffect(() => {
        setData(
            dataSource.filter((data, index) => {
                if (index < DISPLAY_NUMBER) return data;
            })
        );
    }, [dataSource]);

    useEffect(() => {
        setData((_) => {
            const theNumber = DISPLAY_NUMBER * pageIndex;
            const newData = dataSource.filter((data, index) => {
                if (index >= theNumber - DISPLAY_NUMBER && index < theNumber) return data;
            });
            return newData;
        });
    }, [pageIndex]);

    const handleClickIndicate = (isNext: boolean = true) => {
        if (isNext && pageIndex < Math.ceil(dataSource.length / DISPLAY_NUMBER)) setPageIndex(pageIndex + 1);
        else if (!isNext && pageIndex > 1) setPageIndex(pageIndex - 1);
    };

    return (
        <div className="base-carousel relative">
            <div className="base-carousel__heading flex items-center justify-between mb-[10px]">
                <div className="carousel-heading__left text-[18px] font-bold">{title}</div>
                <Button variant="contained" onClick={() => onClickSeeMore()}>
                    {buttonText ? buttonText : 'See More'}
                </Button>
            </div>
            <div className="base-carousel__slider flex items-center gap-x-7">
                {data.map(({ id, title, avatar }) => (
                    <CarouselItem id={id} title={title} avatar={avatar} key={id} onClickItem={() => onClickItem(id)} />
                ))}
            </div>
            <div className="base-carousel__indicator absolute top-[50%] left-0 w-full flex items-center justify-between">
                {pageIndex > 1 && (
                    <div
                        className="carousel-indicator__prev w-[44px] h-[44px] rounded-full border border-solid border-[#ccc] cursor-pointer flex items-center justify-center absolute top-0 -left-5 bg-white"
                        onClick={() => handleClickIndicate(false)}
                    >
                        <Images.ArrowBackIosNewIcon />
                    </div>
                )}
                {pageIndex < Math.ceil(dataSource.length / DISPLAY_NUMBER) && (
                    <div
                        className="carousel-indicator__next w-[44px] h-[44px] rounded-full border border-solid border-[#ccc] cursor-pointer flex items-center justify-center absolute top-0 -right-5 bg-white"
                        onClick={() => handleClickIndicate()}
                    >
                        <Images.ArrowForwardIosIcon />{' '}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Carousel;
