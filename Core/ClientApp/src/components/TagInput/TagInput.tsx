import './TagInput.css';
import React, { useEffect, useRef, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import useQuery from '../../customHooks/useQuery';

const TagInput = () => {
    const query = useQuery();
    const history = useHistory();
    const [values, setValues] = useState<string[]>([]);
    const [value, setValue] = useState('');

    useEffect(() => {
        setValues(query.getAll('tags'));
    }, [query.toString()])

    const filterTag = (tag: string) => tag.replace(/[^\d^a-zа-я]/g, '').slice(0, 10);

    return (
        <React.Fragment>
            <Autocomplete className='autocomplete' multiple freeSolo
                options={[]} size='small' value={values} inputValue={value}
                renderInput={(params) => {
                    const { InputProps, ...restParams } = params;
                    const { startAdornment, ...restInputProps } = InputProps;
                    return (
                        <TextField
                            {...restParams}
                            placeholder={values.length === 0 ? 'Теги для поиска' : ''}
                            InputProps={{
                                ...restInputProps,
                                startAdornment: (
                                    <div style={{ maxHeight: '60px', overflowY: 'hidden' }}>
                                        {startAdornment}
                                    </div>
                                ),
                            }}
                        />
                    )
                }}
                onInputChange={(_, newValue, reason) => {
                    if (reason === 'reset') {
                        setValue('');
                    } else {
                        setValue(filterTag(newValue));
                    }
                }}
                onChange={(_, newValue) => setValues([...(newValue as string[])])}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !value) {
                        history.push(`/search?${values.map(v => "tags=" + v.toLowerCase()).join("&")}`);
                        setValues([]);
                    }
                }}
            />
        </React.Fragment>
    );
}

export default TagInput;