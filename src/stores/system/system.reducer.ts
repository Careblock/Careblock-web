import { AppAction } from '@/types/action.type';
import { SystemActionType, SystemState } from './system.type';

export default function systemReducer(state: SystemState = initialState, action: AppAction): SystemState {
    switch (action.type) {
        case SystemActionType.TOGGLE_COLLAPSE:
            return {
                collapsed: !state.collapsed,
            };
        default:
            return state;
    }
}

const initialState: SystemState = {
    collapsed: false,
};
