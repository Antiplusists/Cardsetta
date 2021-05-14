import { useState } from 'react';
import { InferProps } from 'prop-types';
import { Button } from '@material-ui/core';
import { CardInfo } from '../types/CardInfo'
import QACard from './QACard'
import { Sets } from '../fakeSets'
import { Cards } from '../fakeCards'
import './QAPage.css';

type QAPageState = {
    isFlipped: boolean,
    isReduce: boolean,
    isKnow: boolean | undefined
}

type QAPageProps = {
    setId: number,
}

const defaultPageState = {
    isFlipped: false,
    isReduce: false,
    isKnow: undefined
}

let currentPos = 0;

export default function QAPage({ setId }: InferProps<QAPageProps>) {
    const cardIds = Sets[setId].cardIds;
    const [cardInfo, setCardInfo] = useState<CardInfo>(Cards[cardIds[0]]);
    const [cardState, setCardState] = useState<QAPageState>(defaultPageState);

    function chooseAnswer(isKnow: boolean | undefined) {
        if (cardState.isFlipped) {
            nextCard();
        }
        else {
            setCardState({ ...cardState, isKnow, isFlipped: true });
        }
    }

    function nextCard() {
        setCardState({ ...cardState, isReduce: true });
        setTimeout(() => {
            currentPos++;
            if (currentPos >= cardIds.length) {
                currentPos = 0;
            }
            setCardInfo(Cards[cardIds[currentPos]]);
            setTimeout(() => setCardState(defaultPageState), 100);
        }, 1000);
    }

    return (
        <div className='page'>
            <QACard cardInfo={cardInfo} isFlipped={cardState.isFlipped} isReduce={cardState.isReduce} />
            <div >
                {cardState.isKnow !== false
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
    );
}