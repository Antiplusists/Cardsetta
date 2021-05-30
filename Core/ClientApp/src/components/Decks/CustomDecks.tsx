import { Link } from 'react-router-dom';
import { Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import DeckEntity from '../../entities/Deck';
import { ApiPaths } from '../api-authorization/ApiAuthorizationConstants';
import AuthorizeService from '../api-authorization/AuthorizeService';
import authService from '../api-authorization/AuthorizeService';
import Decks from './Decks';

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
    decks: DeckEntity[],
}

export default function CustomDecks() {
    const classes = useStyles();
    const [decksState, setDecksState] = useState<DecksState>({ isLoading: false, decks: [] });

    const getDecks = async () => {
        const decks: DeckEntity[] = [];
        
        const body = {};
        authService.addAuthorizationHeader(body);
        const response = await fetch(ApiPaths.decks.my, body);
        
        switch (response.status) {
            case 200: 
                decks.push(...(await response.json() as DeckEntity[]));
                break;
            case 401:
                throw new Error('Not authorized');
            case 404:
                break;
            default: throw new Error(`Can not fetch ${ApiPaths.decks.my}`);
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

    const handleDelete = async (deckId: string) => {
        const body = {
            method: 'DELETE'
        };
        authService.addAuthorizationHeader(body);
        const response = await fetch(ApiPaths.decks.byId(deckId), body);
        const user = authService.getUser();
        if (response.status === 204 && user !== null) {
            authService.updateState({ ...user, deckIds: user.deckIds.filter(id => id !== deckId) });
        }
    };

    return (
        <div>
            <Decks {...decksState} isNotFound={decksState.decks.length === 0} onDelete={handleDelete} />
            <Link to='deck-creation'>
                <Fab className={classes.fabOne} color='primary'>
                    <Add />
                </Fab>
            </Link>
        </div>
    );
}
