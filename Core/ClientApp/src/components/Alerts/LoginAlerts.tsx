import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

type LoginAlertsProps = {
    alertsState: LoginAlertsState,
    onClose: (alertsState: LoginAlertsState) => void;
}

export type LoginAlertsState = {
    isLoginOrPasswordError: boolean,
}

export const CreateDefaultState =
    (): LoginAlertsState => ({
        isLoginOrPasswordError: false,
    });

export default function LoginAlerts({ alertsState, onClose }: LoginAlertsProps) {
    const handleAlertsClose =
        () => onClose({ ...CreateDefaultState() });

    return (
        <Snackbar open={alertsState.isLoginOrPasswordError} autoHideDuration={5000} onClose={handleAlertsClose}>
            <Alert variant='filled' severity='error' onClose={handleAlertsClose} >
                Неверный логин или пароль
            </Alert>
        </Snackbar>
    )
};