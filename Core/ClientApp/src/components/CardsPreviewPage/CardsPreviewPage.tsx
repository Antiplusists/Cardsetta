import { Link } from 'react-router-dom';
import { InferProps } from 'prop-types';
import { Fab, IconButton, makeStyles } from '@material-ui/core';
import { Edit, Add, DeleteForever } from '@material-ui/icons';
import {FC, useEffect, useRef, useState} from 'react';
import './CardsPreviewPage.css'
import { ButtonLink } from '../ButtonLink/ButtonLink';
import {Card} from "../../entities/Card";
import {ApiPaths} from "../api-authorization/ApiAuthorizationConstants";
import authService from "../api-authorization/AuthorizeService";
import React from 'react';

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
  deckId: string,
  card: Card,
  onDelete: (cardId: string) => void,
  isAuth: boolean
}

const CardPreview: FC<CardPreviewProps> = ({ card, onDelete, deckId, isAuth }) => {
  const blockRef = useRef<HTMLDivElement>(null);

  function handleDelete() {
    blockRef.current?.classList.add('isDelete');
    setTimeout(() => onDelete(card.id), 500);
  }

  const getOverlay = () => {
    return (
        <div className='overlay'>
          <ButtonLink className='buttonLink'>
            <Link to={`/card-settings/${card.id}?cardset=${deckId}`}>Изменить</Link>
          </ButtonLink>
          <IconButton className='deleteButton' onClick={handleDelete}>
            <DeleteForever />
          </IconButton>
        </div>
    );
  }
  
  return (
    <div ref={blockRef} className='QAcardPreview'>
      <div className='sideQACard'>
        {card.imagePath ? <img src={card.imagePath} alt='questionImage' /> : ''}
        <span>{card.question}</span>
      </div>
      <div className='sideQACard'>
        <span>{card.answer}</span>
      </div>
      {isAuth ? getOverlay() : null}
    </div>
  );
}

type СardsPreviewPageProps = {
  deckId: string,
}

export default function СardsPreviewPage({ deckId}: InferProps<СardsPreviewPageProps>) {
  const classes = useStyles();
  const [cards, setCards] = useState<Card[]>([]);
  const [isAuthorAuth, setIsAuthorAuth] = useState<boolean>(authService.isAuthenticated() 
      && !!authService.getUser()?.deckIds.includes(deckId));
  
  const getCards = async (deckId: string) => {
    const response = await fetch(ApiPaths.cards.default(deckId));
    
    switch (response.status) {
      case 200: break;
      case 404: throw new Error(`Deck with id: ${deckId} is not exist`);
      default: throw new Error(`Can not fetch ${ApiPaths.cards.default(deckId)}`);
    }
    
    return await response.json() as Card[];
  };
  
  useEffect(() => {
    const _subscribe = authService.subscribe(() => setIsAuthorAuth(authService.isAuthenticated()
        && !!authService.getUser()?.deckIds.includes(deckId)));
    
    getCards(deckId)
        .then(cards => setCards(cards));
    
    return () => authService.unsubscribe(_subscribe);
  }, []);

  const handleRemoveCard = async (cardId: string) => {
    setCards(cards => cards.filter(card => card.id !== cardId));
    
    const body = {
      method: 'DELETE'
    };
    authService.addAuthorizationHeader(body);
    const response = await fetch(ApiPaths.cards.byId(deckId, cardId), body);
    
    switch (response.status) {
      case 204: return;
      case 404: throw new Error(`Card ${cardId} in deck ${deckId} is not exist`);
      default: throw new Error(`Can not fetch ${ApiPaths.cards.byId(deckId, cardId)}`);
    }
  }
  
  const getFloatButtons = () => {
    return (
        <React.Fragment>
          <Link to={`/card-creation?cardset=${deckId}`}>
            <Fab className={classes.fabOne} color='primary'>
              <Add/>
            </Fab>
          </Link>

          <Link to={`/cardset-settings/${deckId}`}>
            <Fab className={classes.fabTwo} color='primary'>
              <Edit/>
            </Fab>
          </Link>
        </React.Fragment>
    )
  }
  
  return (
    <div>
      <div className='QAcardsPreview'>
        {cards.map(
          card =>
            <CardPreview key={card.id} card={card} deckId={deckId} isAuth={isAuthorAuth} onDelete={handleRemoveCard} />
        )}
      </div>
      {isAuthorAuth ? getFloatButtons() : null}
    </div>
  );
}