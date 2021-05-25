import { Link } from 'react-router-dom';
import { Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { getAllCardsets } from '../../fakeRepository/fakeCardsets';
import PreviewCardsets from '../PreviewCardsets/PreviewCardsets';

const useStyles = makeStyles({
    fabOne: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    },
});

export default function CustomCardsets() {
    const classes = useStyles();
    return (
        <div className='previews'>
            {getAllCardsets().map(cardset =>
                <PreviewCardsets key={cardset.id} {...cardset} />
            )}
            <Link to='cardset-creation'>
                <Fab className={classes.fabOne} color='primary'>
                    <Add />
                </Fab>
            </Link>
        </div>
    );
}
