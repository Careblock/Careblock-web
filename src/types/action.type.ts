export interface AppAction {
    type: string;
    payload?: { [key: string]: any };
    error?: any;
}
