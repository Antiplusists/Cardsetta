import { useEffect, useState } from 'react';
import { InferProps } from 'prop-types';
import useQuery from '../../customHooks/useQuery';
import { CardEntity, CreateEmptyCard } from "../../entities/Card";
import { ApiPaths } from "../api-authorization/ApiAuthorizationConstants";
import CardPatcher from "../../patchHelpers/CardPatcher";
import authService from "../api-authorization/AuthorizeService";
import CardSettings from './CardSettings';
import LoaderLayout from '../LoaderLayout/LoaderLayout';
import NotFound from "../NotFound/NotFound";

type CardSettingsProps = {
    cardId: string;
}

type State = {
    isLoading: boolean,
    isNotFound: boolean,
    card: CardEntity
}

export default function EditCard({ cardId }: InferProps<CardSettingsProps>) {
    const query = useQuery();
    const deckId = query.get('deck');

    const [state, setState] = useState<State>(
        { isLoading: true, isNotFound: false, card: CreateEmptyCard() });

    const getCard = async () => {
        const response = await fetch(ApiPaths.cards.byId(deckId!, cardId));
        if (response.status === 404) {
            return null;
        }
        return await response.json() as CardEntity;
    };

    useEffect(() => {
        getCard()
            .then(card => {
                if (card !== null) {
                    setState({ ...state, isLoading: false, card });
                } else {
                    setState({ ...state, isNotFound: true });
                }
            });
    }, []);

    const patchCard = async (card: CardEntity) => {
        const patchBuilder = new CardPatcher();
        if (state.card.answer !== card.answer) {
            patchBuilder.patchAnswer(card.answer);
        }
        if (state.card.question !== card.question) {
            patchBuilder.patchQuestion(card.question);
        }
        const data = patchBuilder.build();
        if (data.length === 0) {
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
        const response = await fetch(ApiPaths.cards.byId(deckId!, cardId), body);

        switch (response.status) {
            case 204: break;
            case 401: throw new Error(response.statusText);
            case 404: throw new Error(`Deck ${deckId} or card ${cardId} in deck is not exists`);
            case 422: throw new Error(`Invalid data`);
            default: throw new Error(`Can not fetch ${ApiPaths.cards.byId(deckId!, cardId)}`);
        }
    }

    const updateImage = async (card: CardEntity, file?: File) => {
        if (state.card.imagePath !== card.imagePath) {
            const formData = new FormData();
            if (file)
                formData.append("image", file, file.name);
            
            const body = {
                method: "POST",
                body: formData
            }
            authService.addAuthorizationHeader(body);
            
            const response = await fetch(ApiPaths.cards.updateImage(deckId!, cardId), body);

            switch (response.status) {
                case 204: break;
                case 401: throw new Error(response.statusText);
                case 404: throw new Error(`Deck ${deckId} or card ${cardId} in deck is not exists`);
                case 422: throw new Error(`Invalid data`);
                default: throw new Error(`Can not fetch ${ApiPaths.cards.updateImage(deckId!, cardId)}`);
            }
        }
    }

    async function onSave(card: CardEntity, file?: File) {
        await patchCard(card);
        await updateImage(card, file);
    }
    
    return (
        <LoaderLayout isLoading={state.isLoading} isNotFound={state.isNotFound} componentNotFound={<NotFound />}>
            <CardSettings card={state.card} deckId={deckId!} onSave={onSave} />
        </LoaderLayout>
    );
}