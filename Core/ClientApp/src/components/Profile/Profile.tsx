import './Profile.css';
import PasswordInput from '../Authorization/PasswordInput'
import { InputAdornment } from '@material-ui/core';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { AccountCircle } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { RequiredValidator, PasswordValidators, RepeatPasswordValidators } from '../../validators/Validators'
import { RequiredErrorMessage, PasswordErrorMessages, RepeatPasswordErrorMessages } from '../../validators/ErrorMessage'
import authService from '../api-authorization/AuthorizeService';
import { ApiPaths } from '../api-authorization/ApiAuthorizationConstants';
import ProfileAlerts, { ProfileAlertsState, CreateDefaultState } from '../Alerts/ProfileAlerts';
import { LoadingButton } from '../CustomButtons/LoadingButton';

type ProfileForm = {
    login: string,
    oldPassword: string,
    password: string,
    repeatPassword: string,
}

export default function Profile() {
    const [userName, setUserName] = useState('');
    const [profileForm, setProfileForm] = useState<ProfileForm>(
        { login: userName, oldPassword: '', password: '', repeatPassword: '' });
    const [alertsState, setAlertsState] = useState<ProfileAlertsState>(CreateDefaultState());

    const [isLoadingLogin, setIsLodingLogin] = useState(false);
    const [isLoadingPassword, setIsLodingPassword] = useState(false);

    useEffect(() => {
        ValidatorForm.addValidationRule('isPasswordMatch',
            (value: string) => {
                return value === profileForm.password;
            });

        return () => {
            ValidatorForm.removeValidationRule('isPasswordMatch');
        };
    }, [profileForm.password]);

    useEffect(() => {
        const updateUserName = () => {
            const user = authService.getUser();
            if (user !== null) {
                setUserName(user.userName);
                setProfileForm({ ...profileForm, login: user.userName });
            }
        };
        updateUserName();
        const _subscribe = authService.subscribe(updateUserName);
        return () => authService.unsubscribe(_subscribe);
    }, []);

    async function handleChangeLogin() {
        if (profileForm.login === userName) {
            return;
        }
        setIsLodingLogin(true);
        const body: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify(profileForm.login)
        };
        authService.addAuthorizationHeader(body);
        const response = await fetch(ApiPaths.users.updateUserName, body);
        setIsLodingLogin(false);
        const user = authService.getUser();
        if (response.status === 204 && user) {
            setAlertsState({ ...alertsState, isLoginSuccess: true });
            authService.updateState({ ...user, userName: profileForm.login })
            setUserName(profileForm.login);
        }
        else setAlertsState({ ...alertsState, isLoginError: true });
    }

    async function handleChangePassword() {
        if (profileForm.oldPassword === profileForm.password) {
            return;
        }
        setIsLodingPassword(true);
        const formData = new FormData();
        formData.append('oldPassword', profileForm.oldPassword);
        formData.append('newPassword', profileForm.password);
        formData.append('newPasswordConfirm', profileForm.repeatPassword);
        const body: RequestInit = {
            method: 'POST',
            body: formData
        };
        authService.addAuthorizationHeader(body);
        const response = await fetch(ApiPaths.users.updatePassword, body);
        setIsLodingPassword(false);
        if (response.status === 204) {
            setAlertsState({ ...alertsState, isPasswordSuccess: true });
        }
        else setAlertsState({ ...alertsState, isPasswordError: true });
    }
    return (
        <Fragment>
            <div className='profile'>
                <Fragment>
                    <h1>Профиль {userName}</h1>
                    <ValidatorForm className='form'
                        onSubmit={handleChangeLogin}
                        instantValidate={false}
                    >
                        <TextValidator className='input' label='Логин'
                            variant='outlined' type='text' name='login'
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setProfileForm({ ...profileForm, login: e.target.value })}
                            value={profileForm.login}
                            validators={RequiredValidator}
                            errorMessages={RequiredErrorMessage}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <LoadingButton className='saveLogin' loading={isLoadingLogin}
                            text='Сохранить измения' type='submit' />
                    </ValidatorForm>
                    <ValidatorForm className='form'
                        onSubmit={handleChangePassword}
                        instantValidate={false}
                    >
                        <PasswordInput className='input' label='Старый пароль'
                            value={profileForm.oldPassword}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setProfileForm({ ...profileForm, oldPassword: e.target.value })}
                            validators={PasswordValidators}
                            errorMessages={PasswordErrorMessages}
                        />

                        <PasswordInput className='input' label='Новый пароль'
                            name='password' value={profileForm.password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setProfileForm({ ...profileForm, password: e.target.value })}
                            validators={PasswordValidators}
                            errorMessages={PasswordErrorMessages}
                        />

                        <PasswordInput className='input' label='Повторите пароль'
                            value={profileForm.repeatPassword}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setProfileForm({ ...profileForm, repeatPassword: e.target.value })}
                            validators={RepeatPasswordValidators}
                            errorMessages={RepeatPasswordErrorMessages}
                        />
                        <LoadingButton className='changePassword' loading={isLoadingPassword}
                            text='Изменить пароль' type='submit' />
                    </ValidatorForm>
                </Fragment>
            </div>
            <ProfileAlerts alertsState={alertsState}
                onClose={(state: ProfileAlertsState) => setAlertsState(state)} />
        </Fragment>
    );
}

