import { PATHS } from '@/enums/RoutePath';
import { Link } from 'react-router-dom';
import { SidebarItemValue } from './manager-sidebar.const';

export interface IProps {
    handleClickedItem: Function;
    isActiveItem: Function;
    itemValue: SidebarItemValue;
    collapsed: boolean;
    label: string;
    path: PATHS;
    children: any;
    isCustom?: boolean;
}

const SidebarComponent = ({
    handleClickedItem,
    isActiveItem,
    itemValue,
    collapsed,
    label,
    path,
    children,
    isCustom,
}: IProps) => {
    return (
        <li
            className={`h-[40px] pl-[24px] hover:bg-primary text-black hover:text-white cursor-pointer ${isActiveItem(itemValue) && 'bg-primary text-white'}`}
        >
            <Link
                className="flex items-center gap-x-[10px] w-full h-full"
                to={path}
                onClick={() => handleClickedItem(itemValue)}
            >
                {children}
                {!isCustom && !collapsed && <p className=" text-[16px]">{label}</p>}
            </Link>
        </li>
    );
};

export default SidebarComponent;
