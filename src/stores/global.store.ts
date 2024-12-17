import { combineReducers, legacy_createStore } from 'redux';
import { AuthState, authReducer } from './auth';
import { AppointmentState, appointmentReducer } from './appointment';
import { notificationReducer, NotificationState } from './notification';

export interface GlobalState {
    auth: AuthState;
    appointment: AppointmentState;
    notification: NotificationState;
}

const rootReducer = combineReducers<GlobalState>({
    auth: authReducer as any,
    appointment: appointmentReducer as any,
    notification: notificationReducer as any,
});

const store = legacy_createStore(rootReducer);

export default store;
