import { CarouselItemProps } from './carousel.type';

const CarouselItem = ({ id, title, avatar, onClickItem }: CarouselItemProps) => {
    return (
        <div
            className="carousel__item select-none rounded-lg border border-solid border-[#ddd] w-[18%] h-[180px] overflow-hidden flex items-center justify-center flex-col p-[10px] cursor-pointer"
            onClick={() => onClickItem(id)}
        >
            <div className="carousel-item__avatar w-[80px] h-[80px] mb-[10px] overflow-hidden">
                <img src={avatar} alt="avatar" className="w-full h-full object-contain" />
            </div>
            <div
                className="carousel-item__name font-bold text-[16px] text-center w-full h-[44px] overflow-hidden text-ellipsis line-clamp-2"
                title={title}
            >
                {title}
            </div>
        </div>
    );
};

export default CarouselItem;
