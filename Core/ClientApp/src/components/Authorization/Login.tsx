import './Authorization.css';
import PasswordInput from './PasswordInput'
import { InputAdornment, Button } from '@material-ui/core';
import { ChangeEvent, useState } from 'react';
import { AccountCircle } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

type LoginForm = {
    login: string,
    password: string,
}

export default function Login() {
    const [loginForm, setLoginForm] = useState<LoginForm>({ login: '', password: '' });
    return (
        <ValidatorForm className='authorization'
            onSubmit={() => console.log('submit')}
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
    );
}

