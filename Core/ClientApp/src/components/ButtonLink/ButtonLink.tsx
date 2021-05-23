import styled from '@material-ui/core/styles/styled';
import Button from '@material-ui/core/Button';

export const ButtonLink = styled(
    ({ ...other }) => (
        <Button tabIndex={-1} {...other} />
    )
)({
    padding: '0',
    margin: '10px',
    borderRadius: '15px',
    '&:hover': {
        color: 'white',
        background: 'rgba(255, 255, 255, 0.1)',
    },
    '& a': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderRadius: '15px',
        padding: '10px 15px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 'x-large',
        fontFamily: 'Roboto',
        textTransform: 'none',
        textDecoration: 'none',
    },
    '& a:hover': {
        textDecoration: 'none'
    }
});