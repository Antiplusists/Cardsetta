import './Authorization.css';
import PasswordInput from './PasswordInput'
import { InputAdornment, Button } from '@material-ui/core';
import {ChangeEvent, FC, useEffect, useState} from 'react';
import { AccountCircle } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import {
  ValidatorsLogin, ValidatorsPassword, ValidatorsRepeatPassword,
  ErrorMessagesLogin, ErrorMessagesPassword, ErrorMessagesRepeatPassword
} from './Validators'
import AuthorizeService, {OperationResponse} from "../api-authorization/AuthorizeService";
import {RouteComponentProps, withRouter} from "react-router-dom";

type RegisterFormData = {
  login: string,
  password: string,
  repeatPassword: string,
}

const RegForm: FC<RouteComponentProps> = (props) => {
  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch',
      (value: string) => {
        return value === registerForm.password;
      });

    return () => {
      ValidatorForm.removeValidationRule('isPasswordMatch');
    };
  });
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({ login: '', password: '', repeatPassword: '' });
  
  const onSubmit = async () => {
    let formData = new FormData();
    formData.append('userName', registerForm.login)
    formData.append('password', registerForm.password);
    formData.append('passwordConfirm', registerForm.repeatPassword)

    let response = await AuthorizeService.register(formData);
    switch (response) {
      case OperationResponse.Success: {
        props.history.push('/');
        break;
      }
      case OperationResponse.InvalidData: {
        //TODO: какое-то уведомление о некорректных данных
        break;
      }
      case OperationResponse.ServerError: {
        //TODO: хз что тут сделать можно
        break;
      }
    }
  }
  
  return (
    <ValidatorForm className='authorization'
      onSubmit={onSubmit}
      instantValidate={false}
    >
      <h1>Создать новый аккаунт</h1>
      <TextValidator className='input' label='Логин'
        variant='outlined' type='text' name='login'
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setRegisterForm({ ...registerForm, login: e.target.value })}
        value={registerForm.login}
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
      <PasswordInput className='input' label='Пароль'
        name='password' value={registerForm.password}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setRegisterForm({ ...registerForm, password: e.target.value })}
        validators={ValidatorsPassword}
        errorMessages={ErrorMessagesPassword}
      />
      <PasswordInput className='input' label='Повторите пароль'
        value={registerForm.repeatPassword}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setRegisterForm({ ...registerForm, repeatPassword: e.target.value })}
        validators={ValidatorsRepeatPassword}
        errorMessages={ErrorMessagesRepeatPassword}
      />
      <Button type='submit'>Зарегистрироваться</Button>
    </ValidatorForm>
  );
}

export const Register = withRouter(RegForm);

