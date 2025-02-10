import { AppAction } from '@/types/action.type';
import { SystemActionType } from './system.type';

export const toggleCollapse = (): AppAction => {
    return {
        type: SystemActionType.TOGGLE_COLLAPSE,
    };
};
