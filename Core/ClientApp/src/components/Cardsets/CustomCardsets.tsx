import { Link } from 'react-router-dom';
import { Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import Deck from '../../entities/Deck';
import { ApiPaths } from '../api-authorization/ApiAuthorizationConstants';
import AuthorizeService from '../api-authorization/AuthorizeService';
import authService from '../api-authorization/AuthorizeService';
import Cardsets from './Cardsets';

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

type DecksState = {
    isLoading: boolean,
    decks: Deck[],
}

export default function CustomCardsets() {
    const classes = useStyles();
    const [decksState, setDecksState] = useState<DecksState>({ isLoading: false, decks: [] });

    const getDecks = async () => {
        const deckIds = AuthorizeService.getUser()?.deckIds;
        if (deckIds === undefined) {
            return null;
        }

        const decks: Deck[] = [];
        for (const id of deckIds) {
            const response = await fetch(ApiPaths.decks.byId(id));
            if (response.status === 200) {
                decks.push(await response.json() as Deck);
            }
        }
        return decks;
    }

    useEffect(() => {
        const updateDecks = () => {
            setDecksState({ ...decksState, isLoading: true });
            getDecks()
                .then((decks) => {
                    if (decks === null) {
                        return;
                    }
                    setDecksState({ isLoading: false, decks: [...decks] });
                });
        };
        updateDecks();
        const _subscribe = authService.subscribe(updateDecks);
        return () => authService.unsubscribe(_subscribe);
    }, []);

    return (
        <div>
            <Cardsets {...decksState} isNotFound={decksState.decks.length === 0}/>
            <Link to='cardset-creation'>
                <Fab className={classes.fabOne} color='primary'>
                    <Add />
                </Fab>
            </Link>
        </div>
    );
}
