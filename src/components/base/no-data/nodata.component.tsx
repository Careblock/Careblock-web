import { Images } from '@/assets/images';

const Nodata = () => {
    return (
        <div className="mb-6 flex items-center flex-col justify-center w-full">
            <div className="image w-full overflow-hidden">
                <img className="w-full object-cover" src={Images.BgNodata} alt="no data" />
            </div>
            <div className="text-[18px]">No data to display</div>
        </div>
    );
};

export default Nodata;
