import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

type ProfileAlertsProps = {
    alertsState: RegisterAlertsState,
    onClose: (alertsState: RegisterAlertsState) => void;
}

export type RegisterAlertsState = {
    isLoginError: boolean,
}

export const CreateDefaultState =
    (): RegisterAlertsState => ({
        isLoginError: false,
    });

export default function RegisterAlerts({ alertsState, onClose }: ProfileAlertsProps) {
    const handleAlertsClose =
        () => onClose({ ...CreateDefaultState() });

    return (
        <Snackbar open={alertsState.isLoginError} autoHideDuration={5000} onClose={handleAlertsClose}>
            <Alert variant='filled' severity='error' onClose={handleAlertsClose} >
                Такой логин уже сущестует
            </Alert>
        </Snackbar>
    )
};