import { InferProps } from 'prop-types';
import DeckSettings from './DeckSettings'
import DeckEntity, { CreateEmptyDeck } from '../../entities/Deck';
import authService from '../api-authorization/AuthorizeService';
import { ApiPaths } from '../api-authorization/ApiAuthorizationConstants';
import { useEffect, useState } from 'react';
import LoaderLayout from '../LoaderLayout/LoaderLayout';
import DeckPatcher from '../../patchHelpers/DeckPatcher';
import NotFound from "../NotFound/NotFound";

type EditDeckProps = {
    deckId: string
}

type State = {
    isLoading: boolean,
    isNotFound: boolean,
    deck: DeckEntity
}

export default function EditDeck({ deckId }: InferProps<EditDeckProps>) {
    const [state, setState] = useState<State>(
        { isLoading: true, isNotFound: false, deck: CreateEmptyDeck() });

    const getDeck = async (deckId: string) => {
        const response = await fetch(ApiPaths.decks.byId(deckId));
        if (response.status === 404) {
            return null;
        }
        const deck = await response.json() as DeckEntity;
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

    const onSave = async (deck: DeckEntity, file?: File) => {
        const patchBuilder = new DeckPatcher();
        if (state.deck.name !== deck.name) {
            patchBuilder.patchName(deck.name);
        }
        if (state.deck.description !== deck.description) {
            patchBuilder.patchDescription(deck.description);
        }

        const data = patchBuilder.build();
        if (data.length === 0 && deck.imagePath === state.deck.imagePath) {
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
        
        await updateImage(deck, file);
    }
    
    const updateImage = async (deck: DeckEntity, file?: File) => {
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
            <DeckSettings deck={state.deck} onSave={onSave} pathRedirect={`/cards-preview/${deckId}`} />
        </LoaderLayout>
    );
}