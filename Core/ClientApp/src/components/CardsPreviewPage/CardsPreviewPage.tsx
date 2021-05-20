import { Link } from 'react-router-dom';
import { InferProps } from 'prop-types';
import { Fab, IconButton, makeStyles } from '@material-ui/core';
import { Edit, Add, DeleteForever } from '@material-ui/icons';
import { FC, useRef, useState } from 'react';
import { CardInfo } from '../../types/CardInfo'
import './CardsPreviewPage.css'
import { changeCardsInSetById, getSetById } from '../../fakeRepository/fakeSets'
import { getCardById } from '../../fakeRepository/fakeCards'
import { ButtonLink } from '../ButtonLink/ButtonLink';

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

type CardPreviewProps = {
  setId: string,
  cardInfo: CardInfo,
  onDelete: Function,
}

const CardPreview: FC<CardPreviewProps> = ({ cardInfo, onDelete, setId }) => {
  const { id, questionImg, questionText, answearText } = cardInfo;
  const blockRef = useRef<HTMLDivElement>(null);

  function handleDelete() {
    blockRef.current?.classList.add('isDelete');
    setTimeout(() => onDelete(id), 500);
  }

  return (
    <div ref={blockRef} className='QAcardPreview'>
      <div className='sideQACard'>
        {questionImg !== undefined ? <img src={questionImg} alt='questionImage' /> : ''}
        <span>{questionText}</span>
      </div>
      <div className='sideQACard'>
        <span>{answearText}</span>
      </div>
      <div className='overlay'>
        <ButtonLink className='buttonLink'>
          <Link to={`/card-settings/${id}?set=${setId}`}>Изменить</Link>
        </ButtonLink>
        <IconButton className='deleteButton' onClick={handleDelete}>
          <DeleteForever />
        </IconButton>
      </div>
    </div>
  );
}

type СardsPreviewPageProps = {
  setId: string,
}

export default function СardsPreviewPage({ setId }
  : InferProps<СardsPreviewPageProps>) {
  const classes = useStyles();
  const set = getSetById(setId);
  const [cardIds, setCardIds] = useState<string[]>(set.cardIds);

  function handleRemoveCard(id: string) {
    const ids = cardIds.filter(i => i !== id);
    changeCardsInSetById(setId, ids);
    setCardIds(ids);
  }

  return (
    <div>
      <div className='QAcardsPreview'>
        {set.cardIds.map(
          id =>
            <CardPreview key={id} cardInfo={getCardById(id)} setId={setId} onDelete={handleRemoveCard} />
        )}
      </div>
      <Link to={`/card-settings?set=${setId}`}>
        <Fab className={classes.fabOne} color='primary'>
          <Add />
        </Fab>
      </Link>

      <Link to={`/cardset-settings/${setId}`}>
        <Fab className={classes.fabTwo} color='primary'>
          <Edit />
        </Fab>
      </Link>
    </div>
  );
}