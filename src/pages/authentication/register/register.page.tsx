import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Button, CardContent, Checkbox, FormControlLabel, MenuItem, Select, TextField } from '@mui/material';
import { registerPatientSchema, registerDoctorSchema } from '@/validations/auth.validation';
import { SignUpInitialValues } from '@/types/auth.type';
import { dropDownBloodTypes, dropDownGenders, dropDownRoles } from '@/constants/dropdown.const';
import { INITIAL_VALUES } from '@/constants/common.const';
import { SystemMessage } from '@/constants/message.const';
import OrganizationService from '@/services/organization.service';
import { addToast } from '@/components/base/toast/toast.service';
import AuthService from '@/services/auth.service';
import useObservable from '@/hooks/use-observable.hook';
import { ROLES } from '@/enums/Common';
import { CookieManager } from '@/utils/cookie';
import { PATHS } from '@/enums/RoutePath';
import avatarRegister from '@/assets/images/auth/background.png';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const navigate = useNavigate();
    const { getCookie } = CookieManager();
    const { subscribeOnce } = useObservable();
    const [role, setRole] = useState(ROLES.PATIENT);
    const [imageSrc, setImageSrc] = useState<string>('');
    const [organization, setOrganization] = useState([]);
    const [selectedFile, setSelectedFile] = useState<any>();
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [showAdditionalInfo, setShowAdditionalInfo] = useState<boolean>(false);
    const stakeIdCookie = getCookie('stakeId');
    const stakeId = stakeIdCookie ? JSON.stringify(stakeIdCookie).slice(1, -1) : '';

    const formik = useFormik({
        initialValues: INITIAL_VALUES.REGISTER,
        validationSchema: role === ROLES.PATIENT ? registerPatientSchema : registerDoctorSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const t = URL.createObjectURL(file);
            setImageSrc(t);
        }
    };

    useEffect(() => {
        subscribeOnce(OrganizationService.getAllOrganization(), (res: any) => {
            setOrganization(res.map((data: any) => ({ name: data.name, organizationId: data.id })));
        });
    }, []);

    const handleSubmit = (values: SignUpInitialValues) => {
        if (stakeId === '') {
            addToast({ text: SystemMessage.LOGIN_AGAIN, position: 'top-right', status: 'warn' });
            return;
        }
        if (values.role === ROLES.PATIENT) {
            if ('seniority' in values || 'organizationId' in values) {
                delete values?.seniority;
                delete values?.organizationId;
            }
        }
        subscribeOnce(AuthService.register({ ...values, stakeId: stakeId, avatar: selectedFile }), (res: any) => {
            if (res === '00000000-0000-0000-0000-000000000000') {
                addToast({ text: SystemMessage.ACCOUNT_EXISTED, position: 'top-right', status: 'warn' });
            } else {
                addToast({ text: SystemMessage.REGISTER_SUCCESS, position: 'top-right', status: 'valid' });
                navigate('/');
            }
        });
    };

    const handleChangeRole = (e: any) => {
        formik.handleChange(e);
        setRole(e.target.value);
        setShowAdditionalInfo(e.target.value !== ROLES.PATIENT);
    };

    return (
        <div className="flex min-h-screen bg-center bg-cover rounded-xl">
            <div className="w-full flex items-center rounded-[10px] bg-blue-100 shadow-2xl">
                <div className="flex flex-col justify-center items-center w-1/3 h-full">
                    <img
                        src={avatarRegister}
                        alt="Register logo"
                        className="w-full h-full object-contain rounded"
                        aria-hidden="true"
                    />
                </div>
                <div className="pb-8 w-2/3 min-h-screen flex-1 text-center rounded-xl shadow-sm bg-white">
                    <h2 className="my-4 text-[20px] font-bold text-center">Register</h2>
                    <form onSubmit={formik.handleSubmit} className="w-4/5 mx-auto">
                        <div className="mb-15">
                            <div className="flex flex-col items-center">
                                <img
                                    src={imageSrc ? imageSrc : avatarDefault}
                                    alt="Selected Avatar"
                                    className="w-[80px] h-[80px] object-cover rounded-[175px] border"
                                    aria-hidden="true"
                                />
                                <div className="mt-2 mb-4">
                                    <label
                                        htmlFor="avatar"
                                        className="text-[16px] block font-medium text-gray-700 cursor-pointer"
                                    >
                                        Upload Avatar
                                    </label>
                                    <input
                                        id="avatar"
                                        name="avatar"
                                        type="file"
                                        accept="image/*"
                                        className="sr-only mt-1 focus:ring-blue-500 focus:border-blue-500 block shadow-sm sm:text-sm border-gray-300 rounded"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                            <div className="mb-2">
                                <h3 className="text-left mb-1">Wallet Address</h3>
                                <TextField
                                    disabled
                                    className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                    name="stakeId"
                                    placeholder="Stake Id"
                                    type="text"
                                    size="small"
                                    value={stakeId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.stakeId && Boolean(formik.errors.stakeId)}
                                    helperText={formik.touched.stakeId && formik.errors.stakeId}
                                />
                            </div>
                            <div className="flex gap-3 mb-2">
                                <div className="flex flex-col w-1/2">
                                    <h3 className="text-left mb-1">First name</h3>
                                    <TextField
                                        className="rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                        name="firstname"
                                        placeholder="Type value"
                                        type="text"
                                        size="small"
                                        value={formik.values.firstname}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                                        helperText={formik.touched.firstname && formik.errors.firstname}
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <h3 className="text-left mb-1">Last name</h3>
                                    <TextField
                                        className="rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                        name="lastname"
                                        placeholder="Type value"
                                        type="text"
                                        size="small"
                                        value={formik.values.lastname}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                                        helperText={formik.touched.lastname && formik.errors.lastname}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mb-2">
                                <div className="flex flex-col w-1/2">
                                    <h3 className="text-left mb-1">Date of birth</h3>
                                    <TextField
                                        className="rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                        name="dateOfBirth"
                                        placeholder="Type value"
                                        type="date"
                                        size="small"
                                        value={formik.values.dateOfBirth}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                                        helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <h3 className="text-left mb-1">Email</h3>
                                    <TextField
                                        className="rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                        name="email"
                                        placeholder="Type value"
                                        type="text"
                                        size="small"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mb-2">
                                <div className="flex flex-col w-1/2">
                                    <h3 className="text-left mb-1">Indentity ID</h3>
                                    <TextField
                                        className="rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                        name="identityId"
                                        placeholder="Type value"
                                        type="text"
                                        size="small"
                                        value={formik.values.identityId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.identityId && Boolean(formik.errors.identityId)}
                                        helperText={formik.touched.identityId && formik.errors.identityId}
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <h3 className="text-left mb-1">Phone number</h3>
                                    <TextField
                                        className="rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                        name="phone"
                                        placeholder="Type value"
                                        type="text"
                                        size="small"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                                        helperText={formik.touched.phone && formik.errors.phone}
                                    />
                                </div>
                            </div>
                            {showAdditionalInfo && (
                                <div className="mb-2 gap-3 flex">
                                    <div className="flex flex-col w-1/2">
                                        <h4 className="text-left mb-1">Organization</h4>
                                        <Select
                                            className="w-full"
                                            name="organizationId"
                                            size="small"
                                            value={formik.values.organizationId}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.organizationId && Boolean(formik.errors.organizationId)
                                            }
                                        >
                                            {organization.map((item: any) => (
                                                <MenuItem key={item.organizationId} value={item.organizationId}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <h4 className="text-left mb-1">Experience Year</h4>
                                        <TextField
                                            className="rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                            name="seniority"
                                            placeholder="Type value"
                                            type="number"
                                            size="small"
                                            value={formik.values.seniority}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.seniority && Boolean(formik.errors.seniority)}
                                            helperText={formik.touched.seniority && formik.errors.seniority}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-3 mb-2">
                                <div className="w-1/2">
                                    <h4 className="text-left mb-1">Gender</h4>
                                    <Select
                                        name="gender"
                                        className="w-full"
                                        size="small"
                                        value={formik.values.gender}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.gender && Boolean(formik.errors.gender)}
                                    >
                                        {dropDownGenders.map((item) => (
                                            <MenuItem key={item.gender} value={item.gender}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="w-1/2">
                                    <h4 className="text-left mb-1">Blood Type</h4>
                                    <Select
                                        name="bloodType"
                                        className="w-full"
                                        size="small"
                                        value={formik.values.bloodType}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.bloodType && Boolean(formik.errors.bloodType)}
                                    >
                                        {dropDownBloodTypes.map((item) => (
                                            <MenuItem key={item.bloodType} value={item.bloodType}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className="mb-5">
                                <h4 className="text-left mb-1">Role</h4>
                                <Select
                                    name="role"
                                    className="w-full"
                                    size="small"
                                    value={formik.values.role}
                                    onChange={handleChangeRole}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.role && Boolean(formik.errors.role)}
                                >
                                    {dropDownRoles.map((item) => (
                                        <MenuItem key={item.role} value={item.role}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <Accordion>
                            <AccordionSummary
                                id="panel1a-header"
                                aria-controls="panel1a-content"
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <p className="mb-1">
                                    Before using our services, please read and agree to the following terms and
                                    conditions.
                                </p>
                            </AccordionSummary>
                            <AccordionDetails>
                                <CardContent>
                                    <div className="flex flex-col text-left">
                                        <p className="mb-3">
                                            1. I certify that all the information I provide during the registration
                                            process is accurate, complete, and not deceptive.
                                        </p>
                                        <p className="mb-3">
                                            2. I will keep my password secure and not share my account information with
                                            anyone else.
                                        </p>
                                        <p className="mb-3">
                                            3. I agree that the use of blockchain services will comply with current
                                            local and international regulations and laws.
                                        </p>
                                        <p className="mb-3">
                                            4. I agree that my transactions on the blockchain will be subject to the
                                            conditions and regulations specified in the blockchain system.
                                        </p>
                                        <p className="mb-3">
                                            5. I certify that I am the lawful owner of my blockchain account and will
                                            not use the service to engage in illegal or unlawful activities.
                                        </p>
                                        <p className="mb-3">
                                            6. I agree that blockchain is not responsible for any damages or losses
                                            arising from my failure to comply with these terms and conditions or from
                                            technical errors or other issues on the blockchain system.
                                        </p>
                                    </div>
                                </CardContent>
                            </AccordionDetails>
                        </Accordion>
                        <div className="my-2 flex items-center justify-between">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        id="policy"
                                        size="small"
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label={<p>I Agree</p>}
                                htmlFor="policy"
                            />
                            <Link to={PATHS.DEFAULT}>
                                <Button variant="contained">Back to home</Button>
                            </Link>
                        </div>
                        {isChecked ? (
                            <Button type="submit" className="w-full" variant="contained">
                                Sign Up
                            </Button>
                        ) : (
                            <Button disabled type="submit" className="w-full" variant="contained">
                                Sign Up
                            </Button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
