import React, {useRef} from "react";
import styled from "@material-ui/core/styles/styled";
import {Autocomplete} from "@material-ui/lab";
import {createStyles} from '@material-ui/core';
import {TextField, withStyles} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const TextInput = styled(TextField)({
    width: "300px",
});

const styles = createStyles({
    input: {
        color: "white",
        textTransform: "lowercase",
    }
})

const TagInput = (props: any) => {
    const values = useRef<string[]>([]);
    const input = useRef<HTMLInputElement>();
    const history = useHistory();
    
    return (
        <React.Fragment>
            <Autocomplete
                multiple
                freeSolo
                options={[]}
                limitTags={3}
                renderInput={(params) => {
                    params.InputProps.className += " " + props.classes.input;
                    return (
                        <TextInput
                            {...params}
                            inputRef={input}
                            placeholder="Тэги для поиска"
                        />
                    )
                }}
                onChange={(_, value) => values.current = value}
                onKeyDown={(event) => {
                    if (event.key != "Enter") return;
                    if (input.current?.value) return;
                    if (values.current.length == 0) return;
                    history.push(`/search?${values.current.map(v => "tags=" + v.toLowerCase()).join("&")}`);
                }}
                onKeyUp={() => {
                    if (input.current!.value.length >= 30)
                        input.current!.value = input.current!.value.slice(0, 30);
                    input.current!.value = input.current!.value.replace(/[^\d^a-zа-я]/g, '');
                }}
            />
        </React.Fragment>
    );
}

export default withStyles(styles)(TagInput);