import './Authorization.css';
import PasswordInput from './PasswordInput'
import { Button, InputAdornment } from '@material-ui/core';
import React, { ChangeEvent, Fragment, useState } from 'react';
import { AccountCircle } from '@material-ui/icons';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import AuthorizeService, { OperationResponse } from "../api-authorization/AuthorizeService";
import { RouteComponentProps, withRouter } from "react-router-dom";
import LoginAlerts, { LoginAlertsState, CreateDefaultState } from '../Alerts/LoginAlerts';

type LoginForm = {
    login: string,
    password: string,
}

const LogForm: React.FC<RouteComponentProps> = (props) => {
    const [loginForm, setLoginForm] = useState<LoginForm>({ login: '', password: '' });
    const [alertsState, setAlertsState] = useState<LoginAlertsState>(CreateDefaultState());

    const onSubmit = async () => {
        let formData = new FormData();
        formData.append('userName', loginForm.login)
        formData.append('password', loginForm.password);

        let response = await AuthorizeService.login(formData);
        switch (response) {
            case OperationResponse.Success: {
                props.history.push('/');
                break;
            }
            default: {
                setAlertsState({ ...alertsState, isLoginOrPasswordError: true })
                break;
            }
        }
    }

    return (
        <Fragment>
            <ValidatorForm className='authorization' onSubmit={onSubmit}
            >
                <h1>Вход в аккаунт</h1>
                <TextValidator className='input' label='Логин'
                    variant='outlined' type='text' name='login'
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setLoginForm({ ...loginForm, login: e.target.value })}
                    value={loginForm.login}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                    }}
                />
                <PasswordInput className='input' label='Пароль'
                    name='password' value={loginForm.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setLoginForm({ ...loginForm, password: e.target.value })}
                />
                <Button type='submit'>Войти</Button>
            </ValidatorForm>
            <LoginAlerts alertsState={alertsState}
                onClose={(state: LoginAlertsState) => setAlertsState(state)} />
        </Fragment>
    );
}

export const Login = withRouter(LogForm);

