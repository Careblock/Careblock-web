import { combineReducers, legacy_createStore } from 'redux';
import { AuthState, authReducer } from './auth';
import { AppointmentState, appointmentReducer } from './appointment';

export interface GlobalState {
    auth: AuthState;
    appointment: AppointmentState;
}

const rootReducer = combineReducers<GlobalState>({
    auth: authReducer as any,
    appointment: appointmentReducer as any,
});

const store = legacy_createStore(rootReducer);

export default store;
