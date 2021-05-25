import {useEffect, useRef, useState} from 'react';
import { InferProps } from 'prop-types';
import { Button } from '@material-ui/core';
import { QACard } from '../QACard/QACard'
import './QAPage.css';
import {ApiPaths} from "../api-authorization/ApiAuthorizationConstants";
import {Card} from "../../entities/Card";
import React from 'react';

type QAPageState = {
    isKnow: boolean | undefined,
}

type QAPageProps = {
    deckId: string,
}

const defaultPageState: QAPageState = {
    isKnow: undefined,
}

export default function QAPage({ deckId }: InferProps<QAPageProps>) {
    const cards = useRef<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [position, setPosition] = useState<number>(0);
    const [pageState, setPageState] = useState<QAPageState>(defaultPageState);
    const cardRef = useRef<HTMLDivElement>(null);

    const getCards = async () => {
        const response = await fetch(ApiPaths.cards.default(deckId));

        switch (response.status) {
            case 200: break;
            case 404: throw new Error(`Deck with id: ${deckId} is not exist`);
            default: throw new Error(`Can not fetch ${ApiPaths.cards.default(deckId)}`);
        }

        return await response.json() as Card[];
    }
    
    useEffect(() => {
        setLoading(true);
        getCards()
            .then(v => {
                cards.current = v;
                setLoading(false);
            });
    }, []);
    
    function chooseAnswer(isKnow: boolean | undefined) {
        if (pageState.isKnow !== undefined) {
            nextCard();
        }
        else {
            cardRef.current?.classList.add('isFlipped');
            setPageState({ ...pageState, isKnow });
        }
    }

    function nextCard() {
        cardRef.current?.classList.add('isReduce');
        setTimeout(() => {
            if (position + 1 >= cards.current.length) {
                setPosition(0);
            }
            else setPosition(position + 1);
            setTimeout(() => {
                cardRef.current?.classList.remove('isReduce', 'isFlipped');
                setPageState(defaultPageState);
            }, 100);
        }, 750);
    }

    const getPage = () => {
        return (
            <div className='QAPage'>
                <QACard ref={cardRef} cardInfo={cards.current[position]} />
                <div>
                    {pageState.isKnow !== false
                        ?
                        <div>
                            <Button className='answerButton'
                                    variant='contained' color='primary' onClick={() => chooseAnswer(true)}>
                                Знаю
                            </Button>
                            <Button className='answerButton'
                                    variant='contained' color='primary' onClick={() => chooseAnswer(false)}>
                                Не знаю
                            </Button>
                        </div>
                        :
                        <Button className='answerButton'
                                variant='contained' color='primary' onClick={() => chooseAnswer(undefined)}>
                            Продолжить
                        </Button>
                    }
                </div>
            </div>
        )
    }
    
    return (
        <React.Fragment>
            {loading ? <div>Loading...</div> : getPage()}
        </React.Fragment>
    );
}