import { InputAdornment, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useObservable from '@/hooks/use-observable.hook';
import { FirstStepProps } from './first-step.type';
import { PATHS } from '@/enums/RoutePath';
import store from '@/stores/global.store';
import { Images } from '@/assets/images';
import { setTitle } from '@/utils/document';
import { ExaminationTypes } from '@/types/examinationType.type';
import ExaminationTypeService from '@/services/examinationType.service';

const FirstStep = ({ examinationType, onClickAnExaminationType }: FirstStepProps) => {
    const navigate = useNavigate();
    const { subscribeOnce } = useObservable();
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [examinationTypes, setExaminationTypes] = useState<ExaminationTypes[]>([]);
    const [examinationTypeDisplay, setExaminationTypeDisplay] = useState<ExaminationTypes[] | undefined>([]);

    useEffect(() => {
        setTitle('First step | CareBlock');
    }, []);

    useEffect(() => {
        navigate({
            pathname: PATHS.APPOINTMENT_STEP1,
        });
        subscribeOnce(ExaminationTypeService.getAll(), (res: ExaminationTypes[]) => {
            setExaminationTypes([...res]);
            setExaminationTypeDisplay([...res]);
        });
    }, []);

    useEffect(() => {
        let examinationTypeId = (store.getState() as any).appointment.examinationTypeId;
        if (examinationTypeId) {
            const examinationType = examinationTypes.find((type) => type.id == examinationTypeId);
            if (examinationType) handleClickChooseType(examinationType);
        }
    }, [examinationTypes]);

    useEffect(() => {
        if (!initialized) {
            let result = examinationTypes.filter((type) => {
                if (type.name.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())) return type;
            });
            setExaminationTypeDisplay(result);
        } else setInitialized(false);
    }, [searchValue]);

    const handleSearchValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleClickChooseType = (examinationType: ExaminationTypes) => {
        onClickAnExaminationType(examinationType);
    };

    return (
        <div className="first-steps">
            <div className="first-steps__toolbar flex items-center rounded-lg p-5 bg-[#f5f5f5] mt-5 justify-between">
                <TextField
                    variant="outlined"
                    size="medium"
                    label="Search"
                    placeholder="Enter service's name"
                    value={searchValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSearchValueChanged(event)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Images.SearchIcon className="text-[24px]" />
                            </InputAdornment>
                        ),
                    }}
                />
                {examinationType && (
                    <div className="steps-toolbar__choose flex items-center">
                        <div className="toolbar-choose__text font-bold text-[16px]">{`Your choice:`}</div>
                        <div
                            title={examinationType.name}
                            className="first-steps-content__item ml-[10px] w-[220px] relative select-none rounded-lg border border-solid border-[#ddd] bg-white h-[110px] flex items-center justify-center flex-col p-[10px] cursor-pointer"
                        >
                            <div className="steps-content-item__avatar w-full h-[60px] mt-1 overflow-hidden">
                                <img
                                    alt={examinationType.name}
                                    className="w-full h-full object-contain"
                                    src={examinationType.thumbnail}
                                />
                            </div>
                            <div className="steps-content-item__name font-bold text-[13px] w-full h-[34px] overflow-hidden text-ellipsis text-center line-clamp-2">
                                {examinationType.name}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {examinationTypeDisplay?.length ? (
                <div className="first-steps__content mt-5 grid pt-[10px] px-[10px] pb-0 gap-[30px] grid-cols-5">
                    {examinationTypeDisplay.map((type) => (
                        <div
                            key={type.id}
                            title={type.name}
                            className={`first-steps-content__item relative select-none rounded-lg border border-solid border-[#ddd] bg-white h-[180px] flex items-center justify-center flex-col p-4 cursor-pointer ${type.id === examinationType?.id ? '!bg-[#eee]' : ''}`}
                            onClick={() => handleClickChooseType(type)}
                        >
                            <div className="steps-content-item__avatar w-[80px] h-[80px] mb-[10px] overflow-hidden">
                                <img className="w-full h-full object-contain" alt={type.name} src={type.thumbnail} />
                            </div>
                            <div className="steps-content-item__name font-bold text-[15px] w-full h-[34px] overflow-hidden text-ellipsis text-center line-clamp-2">
                                {type.name}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-6 flex items-center flex-col justify-center w-full">
                    <div className="image w-[300px] overflow-hidden">
                        <img className="w-full object-cover" src={Images.BgNodata} alt="no data" />
                    </div>
                    <div className="text-[20px]">No data to display</div>
                </div>
            )}
        </div>
    );
};

export default FirstStep;
