import { useEffect, useState } from 'react';
import { InferProps } from 'prop-types';
import useQuery from '../../customHooks/useQuery';
import { Redirect } from 'react-router-dom';
import { Card, CreateEmptyCard } from "../../entities/Card";
import { ApiPaths } from "../api-authorization/ApiAuthorizationConstants";
import CardPatcher from "../../patchHelpers/CardPatcher";
import authService from "../api-authorization/AuthorizeService";
import QACardSettings from './QACardSettings';
import LoaderLayout from '../LoaderLayout/LoaderLayout';

type QACardSettingsProps = {
    cardId: string;
}

type State = {
    isLoading: boolean,
    isNotFound: boolean,
    card: Card
}

export default function EditQACard({ cardId }: InferProps<QACardSettingsProps>) {
    const query = useQuery();
    const deckId = query.get('cardset');

    const [state, setState] = useState<State>(
        { isLoading: true, isNotFound: false, card: CreateEmptyCard() });

    const getCard = async () => {
        const response = await fetch(ApiPaths.cards.byId(deckId!, cardId));
        if (response.status === 404) {
            return null;
        }
        return await response.json() as Card;
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

    const patchCard = async (card: Card) => {
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

    const updateImage = async (card: Card) => {
        if (card.imagePath !== card.imagePath) {
            //TODO: надо вытащить файл и положить в formData
        }
    }

    async function onSave(card: Card) {
        await patchCard(card);
        await updateImage(card);
    }

    return (                                                                  // TODO сделать переход на страницу NotFound
        <LoaderLayout isLoading={state.isLoading} isNotFound={state.isNotFound} componentNotFound={<Redirect to='/' />}>
            <QACardSettings card={state.card} deckId={deckId!} onSave={onSave} />
        </LoaderLayout>
    );
}