import { addToast } from '@/components/base/toast/toast.service';
import { SystemMessage } from '@/constants/message.const';
import { useAuth } from '@/contexts/auth.context';
import { ROLES } from '@/enums/Common';
import { PATHS } from '@/enums/RoutePath';
import useObservable from '@/hooks/use-observable.hook';
import AuthService from '@/services/auth.service';
import { storeUser } from '@/stores/auth/auth.action';
import { AuthContextType } from '@/types/auth.type';
import { CookieManager } from '@/utils/cookie';
import { setTitle } from '@/utils/document';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import { Button, Container, Grid } from '@mui/material';
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
        if (wallet) {
            setLoading(true);
            const _assets = await wallet.getAssets();
            const stakeId = await wallet.getRewardAddresses();
            await wallet.getUsedAddresses();
            setCookie('stakeId', stakeId);
            setAssets(_assets);
            setLoading(false);
            subscribeOnce(AuthService.hasAccount(stakeId), (res: any) => {
                if (res === false) {
                    addToast({ text: SystemMessage.HAS_ACCOUNT, position: 'top-right', status: 'warn' });
                    handleClose();
                    navigate(PATHS.REGISTER);
                } else {
                    addToast({ text: SystemMessage.LOGIN_SUCCESS, position: 'top-right', status: 'valid' });
                    subscribeOnce(AuthService.authenticate(stakeId[0]), (res: any) => {
                        const { jwtToken, ...rest } = res;
                        startSession({ accessToken: res.jwtToken, user: rest });
                        dispatch(storeUser(res) as any);
                        if (rest.role === ROLES.DOCTOR) {
                            setTitle('Doctor schedule | CareBlock');
                            navigate(PATHS.DOCTOR_SCHEDULE);
                        } else if (rest.role === ROLES.PATIENT) {
                            setTitle('Home | CareBlock');
                            navigate(PATHS.DEFAULT);
                        } else {
                            setTitle('Home | CareBlock');
                            navigate(PATHS.HOME);
                        }
                        handleClose();
                    });
                }
            });
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
                                    style={{
                                        marginTop: '20px',
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
