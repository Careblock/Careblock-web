export interface CarouselProps {
    title: string;
    buttonText?: string;
    dataSource: CarouselDataSource[];
    onClickSeeMore: Function;
    onClickItem: Function;
}

export interface CarouselDataSource {
    id: string;
    avatar: string;
    title: string;
}

export interface CarouselItemProps {
    id: string;
    avatar: string;
    title: string;
    onClickItem: Function;
}
