import { useEffect, useState } from 'react';
import { InferProps } from 'prop-types';
import { ApiPaths } from "../api-authorization/ApiAuthorizationConstants";
import { CardEntity } from "../../entities/Card";
import LoaderLayout from '../LoaderLayout/LoaderLayout';
import authService from '../api-authorization/AuthorizeService';
import CardsStudy from './CardsStudy';

type CardsBasicStudyProps = {
    deckId: string,
}

export default function CardsBasicStudy({ deckId }: InferProps<CardsBasicStudyProps>) {
    const [cards, setCards] = useState<CardEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isNotFound, setIsNotfound] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const getCards = async () => {
        const response = await fetch(ApiPaths.cards.default(deckId));

        switch (response.status) {
            case 200: break;
            case 404: throw new Error(`Deck with id: ${deckId} is not exist`);
            default: throw new Error(`Can not fetch ${ApiPaths.cards.default(deckId)}`);
        }
        const cards = await response.json() as CardEntity[];
        if (cards.length === 0) {
            setIsEmpty(true);
        }
        return cards.filter(c => new Date() > (c.timeToRepeat[authService.getUser()!.id] ?? 0));
    }

    const updateCards = async () => {
        setIsLoading(true);
        const c = await getCards();
        setCards(c);
        if (c.length === 0) {
            setIsNotfound(true);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        updateCards();
    }, []);

    async function sendAnswer(deckId: string, cardId: string, isKnow: boolean) {
        const body = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(isKnow)
        }
        authService.addAuthorizationHeader(body);

        const response = await fetch(ApiPaths.cards.byId(deckId, cardId), body);

        switch (response.status) {
            case 204: break;
            case 401: throw new Error(response.statusText);
            case 404: throw new Error(`Deck ${deckId} or card ${cardId} in deck is not exists`);
            case 422: throw new Error(`Invalid data`);
            default: throw new Error(`Can not fetch ${ApiPaths.cards.byId(deckId, cardId)}`);
        }
    }

    const componentNotFound = (
        <div className='centerText' >
            {
                isEmpty
                    ?
                    'Карточек еще нет'
                    :
                    'Все карточки изучены'
            }
        </div >
    );

    return (
        <LoaderLayout isLoading={isLoading} isNotFound={isNotFound} componentNotFound={componentNotFound}>
            <CardsStudy cards={cards}
                onTrue={(id: string) => sendAnswer(deckId, id, true)}
                onFalse={(id: string) => sendAnswer(deckId, id, false)}
                onEnd={updateCards}
            />
        </LoaderLayout>
    );
}