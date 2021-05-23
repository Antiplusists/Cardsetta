export const ValidatorsLogin = [
    'required',
];

export const ErrorMessagesLogin = [
    'Это поле не может быть пустым',
];

export const ValidatorsPassword = [
    'required',
    'minStringLength:8',
    'matchRegexp:(?=.*[0-9])',
    'matchRegexp:(?=.*[a-z])',
    'matchRegexp:(?=.*[A-Z])',
    'matchRegexp:(?=.*[!@#$%^&*])',
];

export const ErrorMessagesPassword = [
    'Это поле не может быть пустым',
    'Пароль должен содержать минимум 8 символов',
    'Пароль должен содержать хотя бы одно число',
    'Пароль должен содержать хотя бы одну латинскую букву в нижнем регистре',
    'Пароль должен содержать хотя бы одну латинскую букву в верхнем регистре',
    'Пароль должен содержать хотя бы один спецсимвол',
];

export const ValidatorsRepeatPassword = [
    'required',
    'isPasswordMatch',
];

export const ErrorMessagesRepeatPassword = [
    'Это поле не может быть пустым',
    'Пароли не совпадают',
];