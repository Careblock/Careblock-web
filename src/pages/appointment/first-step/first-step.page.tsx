import { InputAdornment, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import OrganizationService from '@/services/organization.service';
import { Organizations } from '@/types/organization.type';
import useObservable from '@/hooks/use-observable.hook';
import { FirstStepProps } from './first-step.type';
import { PATHS } from '@/enums/RoutePath';
import store from '@/stores/global.store';
import { Images } from '@/assets/images';
import { setTitle } from '@/utils/document';

const FirstStep = ({ organization, onClickAnOrganization }: FirstStepProps) => {
    const navigate = useNavigate();
    const { subscribeOnce } = useObservable();
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [organizations, setOrganizations] = useState<Organizations[]>([]);
    const [organizationDisplay, setOrganizationDisplay] = useState<Organizations[] | undefined>([]);

    useEffect(() => {
        setTitle('First step | CareBlock');
    }, []);

    useEffect(() => {
        navigate({
            pathname: PATHS.APPOINTMENT_STEP1,
        });
        subscribeOnce(OrganizationService.getAllOrganization(), (res: Organizations[]) => {
            setOrganizations([...res]);
            setOrganizationDisplay([...res]);
        });
    }, []);

    useEffect(() => {
        let organizationId = (store.getState() as any).appointment.organizationId;
        if (organizationId) {
            const org = organizations.find((org) => org.id === organizationId);
            if (org) handleClickChooseOrg(org);
        }
    }, [organizations]);

    useEffect(() => {
        if (!initialized) {
            let result = organizations.filter((org) => {
                if (
                    org.code.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    org.name.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    org.city?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    org.district?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    org.address?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())
                )
                    return org;
            });
            setOrganizationDisplay(result);
        } else setInitialized(false);
    }, [searchValue]);

    const handleSearchValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleClickChooseOrg = (org: Organizations) => {
        onClickAnOrganization(org);
    };

    return (
        <div className="first-steps">
            <div className="first-steps__toolbar flex items-center rounded-lg p-5 bg-[#f5f5f5] mt-5 justify-between">
                <TextField
                    variant="outlined"
                    label="Search"
                    helperText="Enter code, name, city, district or address"
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
                {organization && (
                    <div className="steps-toolbar__choose flex items-center">
                        <div className="toolbar-choose__text font-bold text-[16px]">{`Your choice:`}</div>
                        <div
                            title={organization.address}
                            className="first-steps-content__item ml-[10px] w-[220px] relative select-none rounded-lg border border-solid border-[#ddd] bg-white h-[110px] flex items-center justify-center flex-col p-[10px] cursor-pointer"
                        >
                            <div className="steps-content-item__avatar w-full h-[60px] mt-1 overflow-hidden">
                                <img
                                    alt={`Hospital ${organization.name}`}
                                    className="w-full h-full object-contain"
                                    src={organization.thumbnail}
                                />
                            </div>
                            <div
                                className="steps-content-item__name font-bold text-[13px] w-full h-[34px] overflow-hidden text-ellipsis text-center line-clamp-2"
                                title={`${organization.name} Hospital`}
                            >
                                {`${organization.name} Hospital`}
                            </div>
                            <div
                                className="steps-content-item__location absolute -top-[10px] -left-2 text-white py-1 px-[6px] text-[12px] rounded bg-primary max-w-30 overflow-hidden text-ellipsis text-center line-clamp-1"
                                title={organization.address}
                            >
                                {organization.city}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {organizationDisplay?.length ? (
                <div className="first-steps__content mt-5 grid pt-[10px] px-[10px] pb-0 gap-[30px] grid-cols-5">
                    {organizationDisplay.map((org) => (
                        <div
                            key={org.id}
                            title={org.address}
                            className={`first-steps-content__item relative select-none rounded-lg border border-solid border-[#ddd] bg-white h-[180px] flex items-center justify-center flex-col p-4 cursor-pointer ${org.id === organization?.id ? '!bg-[#eee]' : ''}`}
                            onClick={() => handleClickChooseOrg(org)}
                        >
                            <div className="steps-content-item__avatar w-[80px] h-[80px] mb-[10px] overflow-hidden">
                                <img
                                    className="w-full h-full object-contain"
                                    alt={`Hospital ${org.name}`}
                                    src={org.thumbnail}
                                />
                            </div>
                            <div
                                className="steps-content-item__name font-bold text-[15px] w-full h-[34px] overflow-hidden text-ellipsis text-center line-clamp-2"
                                title={`${org.name} Hospital`}
                            >
                                {`${org.name} Hospital`}
                            </div>
                            <div
                                className="steps-content-item__location absolute -top-[14px] -left-[10px] text-white py-1 px-[6px] rounded bg-primary max-w-30 overflow-hidden text-ellipsis text-center line-clamp-1"
                                title={org.address}
                            >
                                {org.city}
                            </div>
                        </div>
                    ))}{' '}
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
