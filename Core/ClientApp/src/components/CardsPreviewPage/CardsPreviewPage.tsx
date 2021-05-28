import './CardsPreviewPage.css'
import { Link } from 'react-router-dom';
import { InferProps } from 'prop-types';
import { Fab, makeStyles } from '@material-ui/core';
import { Edit, Add } from '@material-ui/icons';
import { Fragment, useEffect, useState } from 'react';
import { Card } from "../../entities/Card";
import { ApiPaths } from "../api-authorization/ApiAuthorizationConstants";
import authService from "../api-authorization/AuthorizeService";
import CardPreview from './CardPreview'
import LoaderLayout from '../LoaderLayout/LoaderLayout';

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

type СardsPreviewPageProps = {
  deckId: string,
}

type State = {
  isLoading: boolean,
  cards: Card[]
}

export default function СardsPreviewPage({ deckId }: InferProps<СardsPreviewPageProps>) {
  const classes = useStyles();

  const [state, setState] = useState<State>({ isLoading: true, cards: [] });

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
      .then(cards => {
        setState({ ...state, isLoading: false, cards })
      });

    return () => authService.unsubscribe(_subscribe);
  }, []);

  const handleRemoveCard = async (cardId: string) => {
    setState({ ...state, cards: state.cards.filter(card => card.id !== cardId) });
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

  const getFabButtons = () => {
    return (
      <Fragment>
        <Link to={`/card-creation?cardset=${deckId}`}>
          <Fab className={classes.fabOne} color='primary'>
            <Add />
          </Fab>
        </Link>

        <Link to={`/cardset-settings/${deckId}`}>
          <Fab className={classes.fabTwo} color='primary'>
            <Edit />
          </Fab>
        </Link>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <LoaderLayout className='QAcardsPreview' isLoading={state.isLoading} isNotFound={state.cards.length === 0}
        componentNotFound={<div className='centerText'>Карточек еще нет</div>}>
        {state.cards.map(
          card =>
            <CardPreview key={card.id} card={card} deckId={deckId}
              isAuth={isAuthorAuth} onDelete={handleRemoveCard} />
        )}
      </LoaderLayout>
      {isAuthorAuth ? getFabButtons() : null}
    </Fragment>
  );
}