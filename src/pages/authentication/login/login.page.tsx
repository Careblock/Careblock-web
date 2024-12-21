import { addToast } from '@/components/base/toast/toast.service';
import { SystemMessage } from '@/constants/message.const';
import { useAuth } from '@/contexts/auth.context';
import { ROLE_NAMES } from '@/enums/Common';
import { PATHS } from '@/enums/RoutePath';
import useObservable from '@/hooks/use-observable.hook';
import AuthService from '@/services/auth.service';
import { storeUser } from '@/stores/auth/auth.action';
import { AuthContextType } from '@/types/auth.type';
import { CookieManager } from '@/utils/cookie';
import { setTitle } from '@/utils/document';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import { Button, Container, Grid } from '@mui/material';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export const Login = ({ handleClose }: any) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setCookie } = CookieManager();
    const { subscribeOnce } = useObservable();
    const { startSession } = useAuth() as AuthContextType;
    const { wallet, connected } = useWallet();
    const [assets, setAssets] = useState<null | any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setTitle('Login | CareBlock');
    }, []);

    const getAssets = async () => {
        try {
            if (wallet) {
                setLoading(true);
                const _assets = await wallet.getAssets();
                const stakeId = await wallet.getRewardAddresses();
                await wallet.getUsedAddresses();
                setCookie('stakeId', stakeId);
                setAssets(_assets);
                setLoading(false);
                if (!stakeId) return;
                subscribeOnce(AuthService.hasAccount(stakeId), (res: any) => {
                    if (res === false) {
                        addToast({ text: SystemMessage.HAS_ACCOUNT, position: 'top-right', status: 'warn' });
                        handleClose();
                        navigate(PATHS.REGISTER);
                    } else {
                        addToast({ text: SystemMessage.LOGIN_SUCCESS, position: 'top-right', status: 'valid' });
                        subscribeOnce(AuthService.authenticate(stakeId[0]), (res: any) => {
                            const { jwtToken, ...rest } = res;
                            const roles = (jwtDecode<JwtPayload>(jwtToken) as any)?.roles?.split(',');
                            startSession({ accessToken: res.jwtToken, user: { ...rest, roles } });
                            dispatch(storeUser(res) as any);
                            if (roles.includes(ROLE_NAMES.PATIENT)) {
                                setTitle('Home | CareBlock');
                                navigate(PATHS.DEFAULT);
                            } else if (roles.includes(ROLE_NAMES.DOCTOR)) {
                                setTitle('Doctor schedule | CareBlock');
                                navigate(PATHS.DOCTOR_SCHEDULE);
                            } else if (roles.includes(ROLE_NAMES.MANAGER)) {
                                setTitle('Doctor Manager | CareBlock');
                                navigate(PATHS.ORGANIZATION_INFOR);
                            } else if (roles.includes(ROLE_NAMES.ADMIN)) {
                                setTitle('Admin | CareBlock');
                                navigate(PATHS.ORGANIZATION_ADMIN);
                            } else {
                                setTitle('Home | CareBlock');
                                navigate(PATHS.HOME);
                            }
                            handleClose();
                        });
                    }
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
            <Grid justifyContent="center" alignItems="center" container>
                <div className="text-2xl">
                    <h1 className="text-3xl mb-10 bold">LOGIN</h1>
                    <CardanoWallet />
                    {connected && (
                        <>
                            {assets ? (
                                <pre></pre>
                            ) : (
                                <Button
                                    onClick={getAssets}
                                    disabled={loading}
                                    size="large"
                                    style={{
                                        marginTop: '50px',
                                        fontSize: '18px',
                                    }}
                                >
                                    CONFIRM
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </Grid>
        </Container>
    );
};
