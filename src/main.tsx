import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import Routes from './routes/router.tsx';
import Loading from './components/base/loading/loading.component.tsx';
import StartupImport from './startup-import.tsx';
import { theme } from './constants/var.const.ts';
import ToastContainer from './components/base/toast/toast.container.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <StartupImport>
            <ThemeProvider theme={theme}>
                <Routes />
            </ThemeProvider>
            <ToastContainer />
            <Loading />
        </StartupImport>
    </React.StrictMode>
);
