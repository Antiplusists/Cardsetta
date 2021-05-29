import './TagInput.css';
import React, {useRef} from "react";
import {Autocomplete} from "@material-ui/lab";
import {TextField} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const TagInput = () => {
    const values = useRef<string[]>([]);
    const input = useRef<HTMLInputElement>();
    const history = useHistory();
    
    return (
        <React.Fragment>
            <Autocomplete
                className="autocomplete"
                multiple
                freeSolo
                options={[]}
                limitTags={3}
                size="small"
                renderInput={(params) => {
                    return (
                        <TextField
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

export default TagInput;