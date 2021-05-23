import './Profile.css';
import PasswordInput from '../Authorization/PasswordInput'
import { InputAdornment, Button, } from '@material-ui/core';
import { ChangeEvent, useEffect, useState } from 'react';
import { AccountCircle } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import {
    ValidatorsLogin, ValidatorsPassword, ValidatorsRepeatPassword,
    ErrorMessagesLogin, ErrorMessagesPassword, ErrorMessagesRepeatPassword
} from '../Authorization/Validators'

type ProfileForm = {
    login: string,
    oldPassword: string,
    password: string,
    repeatPassword: string,
}

export default function Profile() {
    useEffect(() => {
        ValidatorForm.addValidationRule('isPasswordMatch',
            (value: string) => {
                return value === profileForm.password;
            });

        return () => {
            ValidatorForm.removeValidationRule('isPasswordMatch');
        };
    });
    const [profileForm, setProfileForm] = useState<ProfileForm>({ login: '', oldPassword: '', password: '', repeatPassword: '' });
    return (
        <div className='profile'>
            <h1>Профиль Username</h1>
            <ValidatorForm className='form'
                onSubmit={() => console.log('submit')}
                instantValidate={false}
            >
                <TextValidator className='input' label='Логин'
                    variant='outlined' type='text' name='login'
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setProfileForm({ ...profileForm, login: e.target.value })}
                    value={profileForm.login}
                    validators={ValidatorsLogin}
                    errorMessages={ErrorMessagesLogin}
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
                onSubmit={() => console.log('submit')}
                instantValidate={false}
            >
                <PasswordInput className='input' label='Старый пароль'
                    value={profileForm.oldPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setProfileForm({ ...profileForm, oldPassword: e.target.value })}
                    validators={ValidatorsPassword}
                    errorMessages={ErrorMessagesPassword}
                />

                <PasswordInput className='input' label='Новый пароль'
                    name='password' value={profileForm.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setProfileForm({ ...profileForm, password: e.target.value })}
                    validators={ValidatorsPassword}
                    errorMessages={ErrorMessagesPassword}
                />

                <PasswordInput className='input' label='Повторите пароль'
                    value={profileForm.repeatPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setProfileForm({ ...profileForm, repeatPassword: e.target.value })}
                    validators={ValidatorsRepeatPassword}
                    errorMessages={ErrorMessagesRepeatPassword}
                />
                <Button className='changePassword' type='submit'>Изменить пароль</Button>
            </ValidatorForm>
        </div>
    );
}

