import styled from '@material-ui/core/styles/styled';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';

export const LoadingButton = styled(
    ({ loading = false, text, ...other }) => (
        <Button disabled={loading} {...other} >
            {loading
                ?
                <CircularProgress size={25} />
                :
                text}
        </Button>
    )
)({
    '& .MuiCircularProgress-root': {
        color: 'white',
    },
});