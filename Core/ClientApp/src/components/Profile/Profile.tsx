import './Profile.css';
import PasswordInput from '../Authorization/PasswordInput'
import { InputAdornment, Button, } from '@material-ui/core';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { AccountCircle } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { LoginValidators, PasswordValidators, RepeatPasswordValidators } from '../../validators/Validators'
import { LoginErrorMessages, PasswordErrorMessages, RepeatPasswordErrorMessages } from '../../validators/ErrorMessage'
import authService from '../api-authorization/AuthorizeService';
import { Redirect } from 'react-router';
import { ApiPaths } from '../api-authorization/ApiAuthorizationConstants';
import ProfileAlerts, { ProfileAlertsState, CreateDefaultState } from '../Alerts/ProfileAlerts';

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
        const body: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify(profileForm.login)
        };
        authService.addAuthorizationHeader(body);
        const response = await fetch(ApiPaths.users.updateUserName, body);
        const user = authService.getUser();
        if (response.status === 204 && user) {
            setAlertsState({ ...alertsState, isLoginSuccess: true });
            authService.updateState({ ...user, userName: profileForm.login })
            setUserName(profileForm.login);
        }
        else setAlertsState({ ...alertsState, isLoginError: true });
    }

    async function handleChangePassword() {
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
                            validators={LoginValidators}
                            errorMessages={LoginErrorMessages}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button className='saveLogin' type='submit'>Сохранить измения</Button>
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
                        <Button className='changePassword' type='submit'>Изменить пароль</Button>
                    </ValidatorForm>
                </Fragment>
            </div>
            <ProfileAlerts alertsState={alertsState}
                onClose={(state: ProfileAlertsState) => setAlertsState(state)} />
        </Fragment>
    );
}

