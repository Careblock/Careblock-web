import { AppointmentActionType, AppointmentState } from './appointment.type';
import { AppAction } from '@/types/action.type';

export default function appointmentReducer(
    state: AppointmentState = initialState,
    action: AppAction
): AppointmentState {
    switch (action.type) {
        case AppointmentActionType.STORE_APPOINTMENT:
            return {
                ...state,
                organizationId: action.payload?.organizationId,
            };
        case AppointmentActionType.CLEAR_APPOINTMENT:
            return initialState;
        default:
            return state;
    }
}

const initialState: AppointmentState = {
    organizationId: '',
};
