import { useEffect, useState } from 'react';
import { InferProps } from 'prop-types';
import { ApiPaths } from "../api-authorization/ApiAuthorizationConstants";
import { CardEntity } from "../../entities/Card";
import LoaderLayout from '../LoaderLayout/LoaderLayout';
import CardsStudy from './CardsStudy';

type CardsEndlessStudyProps = {
    deckId: string,
}

export default function CardsEndlessStudy({ deckId }: InferProps<CardsEndlessStudyProps>) {
    const [cards, setCards] = useState<CardEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isNotFound, setIsNotfound] = useState(false);

    const getCards = async () => {
        const response = await fetch(ApiPaths.cards.default(deckId));

        switch (response.status) {
            case 200: break;
            case 404: throw new Error(`Deck with id: ${deckId} is not exist`);
            default: throw new Error(`Can not fetch ${ApiPaths.cards.default(deckId)}`);
        }
        const cards = await response.json() as CardEntity[];
        return cards;
    }

    useEffect(() => {
        setIsLoading(true);
        getCards()
            .then(с => {
                setCards(с);
                if (с.length === 0) {
                    setIsNotfound(true);
                }
                setIsLoading(false);
            });
    }, []);

    return (
        <LoaderLayout isLoading={isLoading} isNotFound={isNotFound}
            componentNotFound={<div className='centerText'>Карточек еще нет</div>}>
            <CardsStudy cards={cards} />
        </LoaderLayout>
    );
}