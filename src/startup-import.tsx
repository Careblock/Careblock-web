import { HelmetProvider } from 'react-helmet-async';
import { MeshProvider } from '@meshsdk/react';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { AuthProvider } from './contexts/auth.context.tsx';
import store from './stores/global.store.ts';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@/types/tailwindcss.type.ts';
import './assets/styles/css/index.css';
import './assets/styles/css/main.css';

const StartupImport = ({ children }: { children: ReactNode }) => {
    return (
        <Provider store={store}>
            <HelmetProvider>
                <MeshProvider>
                    <AuthProvider>{children}</AuthProvider>
                </MeshProvider>
            </HelmetProvider>
        </Provider>
    );
};

export default StartupImport;
