import { AppAction } from '@/types/action.type';
import { ManagerActionType, ManagerState } from './manager.type';

export default function ManagerReducer(state: ManagerState = initialState, action: AppAction): ManagerState {
    switch (action.type) {
        case ManagerActionType.SET_NOT_ASSIGNED:
            return {
                numberNotAssigned: action.payload?.numberNotAssigned,
            };
        default:
            return state;
    }
}

const initialState: ManagerState = {
    numberNotAssigned: 0,
};
