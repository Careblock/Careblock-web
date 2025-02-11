import { combineReducers, legacy_createStore } from 'redux';
import { AuthState, authReducer } from './auth';
import { AppointmentState, appointmentReducer } from './appointment';
import { notificationReducer, NotificationState } from './notification';
import { systemReducer, SystemState } from './system';
import { managerReducer, ManagerState } from './manager';

export interface GlobalState {
    auth: AuthState;
    appointment: AppointmentState;
    notification: NotificationState;
    system: SystemState;
    manager: ManagerState;
}

const rootReducer = combineReducers<GlobalState>({
    auth: authReducer as any,
    appointment: appointmentReducer as any,
    notification: notificationReducer as any,
    system: systemReducer as any,
    manager: managerReducer as any,
});

const store = legacy_createStore(rootReducer);

export default store;
