import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Fragment } from "react";

type ProfileAlertsProps = {
    alertsState: ProfileAlertsState,
    onClose: (alertsState: ProfileAlertsState) => void;
}

export type ProfileAlertsState = {
    isLoginSuccess: boolean,
    isLoginError: boolean,
    isPasswordSuccess: boolean,
    isPasswordError: boolean,
}

export const CreateDefaultState =
    (): ProfileAlertsState => ({
        isLoginSuccess: false,
        isLoginError: false,
        isPasswordSuccess: false,
        isPasswordError: false
    });

export default function ProfileAlerts({ alertsState, onClose }: ProfileAlertsProps) {
    const handleAlertsClose =
        () => onClose({ ...CreateDefaultState() });

    return (
        <Fragment>
            <Snackbar open={alertsState.isLoginSuccess} autoHideDuration={5000} onClose={handleAlertsClose}>
                <Alert variant='filled' severity='success' onClose={handleAlertsClose} >
                    Логин успешно изменен
                </Alert>
            </Snackbar>
            <Snackbar open={alertsState.isLoginError} autoHideDuration={5000} onClose={handleAlertsClose}>
                <Alert variant='filled' severity='error' onClose={handleAlertsClose} >
                    Такой логин уже сущестует
                </Alert>
            </Snackbar>
            <Snackbar open={alertsState.isPasswordSuccess} autoHideDuration={5000} onClose={handleAlertsClose}>
                <Alert variant='filled' severity='success' onClose={handleAlertsClose} >
                    Пароль успешно изменен
                </Alert>
            </Snackbar>
            <Snackbar open={alertsState.isPasswordError} autoHideDuration={5000} onClose={handleAlertsClose}>
                <Alert variant='filled' severity='error' onClose={handleAlertsClose} >
                    Неверный старый пароль
                </Alert>
            </Snackbar>
        </Fragment>
    )
};