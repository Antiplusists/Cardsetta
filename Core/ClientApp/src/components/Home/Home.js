import { makeStyles } from '@material-ui/core/styles';
import { getAllCardsets } from '../../fakeRepository/fakeSets';
import PreviewSetCards from '../PreviewSetCards/PreviewSetCards';

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
        <PreviewSetCards key={cardset.id} {...cardset} />
      )}
    </div>
  );
}
