import { Link } from 'react-router-dom';
import { InferProps } from 'prop-types';
import { Link as NavLink, Fab, makeStyles } from '@material-ui/core';
import { Edit, Add } from '@material-ui/icons';
import { FC } from 'react';
import { CardInfo } from '../types/CardInfo'
import './CardsPreviewPage.css'
import { Sets } from '../fakeSets'
import { Cards } from '../fakeCards'

const useStyles = makeStyles({
  fabOne: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  fabTwo: {
    margin: 0,
    top: 'auto',
    right: 90,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
});

const CardPreview: FC<CardInfo> = ({ id, questionImg, questionText, answearText }) => {
  return (
    <div className='QAcardPreview'>
      <div className='sideQACard'>
        {questionImg !== undefined ? <img src={questionImg} alt='questionImage' /> : ''}
        <span>{questionText}</span>
      </div>
      <div className='sideQACard'>
        <span>{answearText}</span>
      </div>
      <div className='overlay'>
        <NavLink className='changeButton' component={Link} to={'/card-settings/' + id}>Изменить</NavLink>
      </div>
    </div>

  );
}

type СardsPreviewPageProps = {
  setId: number,
}

export default function СardsPreviewPage({ setId }
  : InferProps<СardsPreviewPageProps>) {
  const classes = useStyles();

  function handleAddCard() {
    Sets[setId].cardIds.push(Cards.length);
  }

  return (
    <div>
      <div className='QAcardsPreview'>
        {Sets[setId].cardIds.map(
          id =>
            <CardPreview key={id}
              id={id}
              questionImg={Cards[id].questionImg}
              questionText={Cards[id].questionText}
              answearText={Cards[id].answearText}
            />
        )}
      </div>
      <Fab className={classes.fabOne} color='primary' onClick={handleAddCard}  component={Link} to='/card-settings'>
        <Add />
      </Fab>
      <Fab className={classes.fabTwo} color='primary'>
        <Edit />
      </Fab>
    </div>
  );
}