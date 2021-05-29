import { InferProps } from 'prop-types';
import CardsetSettings from './CardsetSettings'
import Deck, { CreateEmptyDeck } from '../../entities/Deck';
import authService from '../api-authorization/AuthorizeService';
import { ApiPaths } from '../api-authorization/ApiAuthorizationConstants';
import { useEffect, useState } from 'react';
import LoaderLayout from '../LoaderLayout/LoaderLayout';
import DeckPatcher from '../../patchHelpers/DeckPatcher';
import NotFound from "../NotFound/NotFound";

type EditCardsetProps = {
    deckId: string
}

type State = {
    isLoading: boolean,
    isNotFound: boolean,
    deck: Deck
}

export default function EditCardset({ deckId }: InferProps<EditCardsetProps>) {
    const [state, setState] = useState<State>(
        { isLoading: true, isNotFound: false, deck: CreateEmptyDeck() });

    const getDeck = async (deckId: string) => {
        const response = await fetch(ApiPaths.decks.byId(deckId));
        if (response.status === 404) {
            return null;
        }
        const deck = await response.json() as Deck;
        return deck;
    }

    useEffect(() => {
        getDeck(deckId)
            .then(deck => {
                if (deck !== null) {
                    setState({ ...state, isLoading: false, deck });
                } else {
                    setState({ ...state, isNotFound: true });
                }
            });
    }, []);

    const onSave = async (cardset: Deck, file?: File) => {
        const patchBuilder = new DeckPatcher();
        if (state.deck.name !== cardset.name) {
            patchBuilder.patchName(cardset.name);
        }
        if (state.deck.description !== cardset.description) {
            patchBuilder.patchDescription(cardset.description);
        }

        const data = patchBuilder.build();
        if (data.length === 0 && cardset.imagePath === state.deck.imagePath) {
            return;
        }

        const body: RequestInit = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify(data)
        };
        authService.addAuthorizationHeader(body);

        const response = await fetch(ApiPaths.decks.byId(deckId), body);

        switch (response.status) {
            case 204: break;
            case 401: throw new Error(response.statusText);
            case 404: throw new Error(`Deck ${deckId} not found`);
            case 422: throw new Error(`Invalid data`);
            default: throw new Error(`Can not fetch ${ApiPaths.decks.byId(deckId)}`);
        }
        
        await updateImage(cardset, file);
    }
    
    const updateImage = async (deck: Deck, file?: File) => {
        if (state.deck.imagePath === deck.imagePath) return;
        const formData = new FormData();
        if (file)
            formData.append("image", file, file.name);
        const body = {
            method: "POST",
            body: formData
        }
        authService.addAuthorizationHeader(body);
        
        const response = await fetch(ApiPaths.decks.updateImage(deckId), body);
        
        switch (response.status) {
            case 204: break;
            case 401: throw new Error(response.statusText);
            case 404: throw new Error(`Deck ${deckId} not found`);
            case 422: throw new Error(`Invalid data`);
            default: throw new Error(`Can not fetch ${ApiPaths.decks.updateImage(deckId)}`);
        }
    }
    
    return (
        <LoaderLayout isLoading={state.isLoading} isNotFound={state.isNotFound} componentNotFound={<NotFound />}>
            <CardsetSettings deck={state.deck} onSave={onSave} pathRedirect={`/cards-preview/${deckId}`} />
        </LoaderLayout>
    );
}