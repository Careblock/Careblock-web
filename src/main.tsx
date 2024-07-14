import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import Routes from './routes/router.tsx';
import Loading from './components/base/loading/loading.component.tsx';
import StartupImport from './startup-import.tsx';
import { theme } from './constants/var.const.ts';
import ToastContainer from './components/base/toast/toast.container.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StartupImport>
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Routes />
            </LocalizationProvider>
        </ThemeProvider>
        <ToastContainer />
        <Loading />
    </StartupImport>
);
