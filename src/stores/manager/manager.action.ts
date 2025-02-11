import { AppAction } from '@/types/action.type';
import { ManagerActionType } from './manager.type';

export const setNotAssigned = (numberNotAssigned: number): AppAction => {
    return {
        type: ManagerActionType.SET_NOT_ASSIGNED,
        payload: {
            numberNotAssigned,
        },
    };
};
