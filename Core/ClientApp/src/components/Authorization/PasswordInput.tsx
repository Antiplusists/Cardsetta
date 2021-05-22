import { InferProps } from 'prop-types';
import { useState } from 'react';
import { Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import { IconButton, InputAdornment } from '@material-ui/core';
import { TextValidator } from 'react-material-ui-form-validator';

type PasswordInputProps = {
    label: string,
    name?: string,
    className: string,
    value?: string,
    onChange?: string,
    validators?: string[],
    errorMessages?: string[],
}

export default function PasswordInput(props: InferProps<PasswordInputProps>) {
    const [showPassword, setShowPassword] = useState(false);
    const { label, className, name, value, onChange, validators, errorMessages } = props;
    return (
        <TextValidator variant='outlined' className={className}
            label={label} name={name} onChange={onChange} value={value}
            validators={validators} errorMessages={errorMessages}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
                startAdornment: (
                    <InputAdornment position='start'>
                        <Lock />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position='end'>
                        <IconButton tabIndex={-1}
                            onClick={() => setShowPassword(!showPassword)}
                            edge='end'
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
}