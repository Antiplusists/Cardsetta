import './Authorization.css';
import PasswordInput from './PasswordInput'
import { InputAdornment, Button } from '@material-ui/core';
import { ChangeEvent, FC, Fragment, useEffect, useState } from 'react';
import { AccountCircle } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { LoginValidators, PasswordValidators, RepeatPasswordValidators } from '../../validators/Validators'
import { LoginErrorMessages, PasswordErrorMessages, RepeatPasswordErrorMessages } from '../../validators/ErrorMessage'
import AuthorizeService, { OperationResponse } from "../api-authorization/AuthorizeService";
import { RouteComponentProps, withRouter } from "react-router-dom";
import RegisterAlerts, { RegisterAlertsState, CreateDefaultState } from '../Alerts/RegisterAlerts';

type RegisterFormData = {
  login: string,
  password: string,
  repeatPassword: string,
}

const RegForm: FC<RouteComponentProps> = (props) => {
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({ login: '', password: '', repeatPassword: '' });
  const [alertsState, setAlertsState] = useState<RegisterAlertsState>(CreateDefaultState());
  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch',
      (value: string) => {
        return value === registerForm.password;
      });

    return () => {
      ValidatorForm.removeValidationRule('isPasswordMatch');
    };
  }, [registerForm.password]);

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
      default: {
        setAlertsState({ ...alertsState, isLoginError: true });
      }
    }
  }

  return (
    <Fragment>
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
        <PasswordInput className='input' label='Пароль'
          name='password' value={registerForm.password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRegisterForm({ ...registerForm, password: e.target.value })}
          validators={PasswordValidators}
          errorMessages={PasswordErrorMessages}
        />
        <PasswordInput className='input' label='Повторите пароль'
          value={registerForm.repeatPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRegisterForm({ ...registerForm, repeatPassword: e.target.value })}
          validators={RepeatPasswordValidators}
          errorMessages={RepeatPasswordErrorMessages}
        />
        <Button type='submit'>Зарегистрироваться</Button>
      </ValidatorForm>
      <RegisterAlerts alertsState={alertsState}
        onClose={(state: RegisterAlertsState) => setAlertsState(state)} />
    </Fragment>
  );
}

export const Register = withRouter(RegForm);

