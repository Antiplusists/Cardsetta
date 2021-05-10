import { Link as NavLink, Fab, makeStyles } from '@material-ui/core';
import { Edit, Add } from '@material-ui/icons';
import { FC } from 'react';
import { CardInfo } from '../types/CardInfo'
import './CardsPreviewPage.css'

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

const CardPreview: FC<CardInfo> = ({ questionImg, questionText, answearText }) => {
  return (
    <div className='cardPreview'>
      <div className='previewSideQACard'>
        {questionImg !== undefined ? <img src={questionImg} alt='questionImage' /> : ""}
        <span>{questionText}</span>
      </div>
      <div className='previewSideQACard '>
        <span>{answearText}</span>
      </div>
      <div className='overlay'>
        <NavLink className='changeButton'>Изменить</NavLink>
      </div>
    </div>

  );
}

export default function СardsPreviewPage() {
  const classes = useStyles();
  return (
    <div>
      <div className='cardsPreview'>
        <CardPreview questionImg='images/forTest/tree.png' questionText='Tree' answearText='Дерево' />
        <CardPreview questionImg='images/forTest/tree_2.png' questionText='Real tree' answearText='Настоящее дерево' />
        <CardPreview questionText='House' answearText='Жилой дом' />
      </div>
      <Fab className={classes.fabOne} color='primary'>
        <Add />
      </Fab>
      <Fab className={classes.fabTwo} color='primary'>
        <Edit />
      </Fab>
    </div>
  );
}