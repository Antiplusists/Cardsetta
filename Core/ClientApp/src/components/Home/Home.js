import { makeStyles } from '@material-ui/core/styles';
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
      <PreviewSetCards imgPreview='images/forTest/tree.png' setId={0} />
      <PreviewSetCards imgPreview='images/forTest/tree_2.png' setId={1} />
      <PreviewSetCards setId={2} />
    </div>
  );
}
