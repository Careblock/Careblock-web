import { CarouselProps as TailwindCarouselProps } from '@material-tailwind/react';

export interface CarouselItem {
    imageSrc: string;
    title: string;
    description: string;
    leftButtonLabel: string;
    rightButtonLabel: string;
}

export interface CarouselProps extends TailwindCarouselProps {
    items: CarouselItem[];
}
