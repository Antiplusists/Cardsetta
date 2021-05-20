import { makeStyles } from '@material-ui/core/styles';
import { getAllCardsets } from '../../fakeRepository/fakeCardsets';
import PreviewCardsets from '../PreviewCardsets/PreviewCardsets';

const useStyles = makeStyles(() => ({
  previews: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '75px'
  }
}));

export default function Home() {
  const classes = useStyles();
  return (
    <div className={classes.previews}>
      {getAllCardsets().map(cardset =>
        <PreviewCardsets key={cardset.id} {...cardset} />
      )}
    </div>
  );
}
