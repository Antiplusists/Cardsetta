import { useRef, useState } from 'react';
import { InferProps } from 'prop-types';
import { Button } from '@material-ui/core';
import { CardInfo } from '../../types/CardInfo'
import { QACard } from '../QACard/QACard'
import { getSetById } from '../../fakeRepository/fakeSets'
import { getCardById } from '../../fakeRepository/fakeCards'
import './QAPage.css';

type QAPageState = {
    isKnow: boolean | undefined,
}

type QAPageProps = {
    setId: string,
}

const defaultPageState: QAPageState = {
    isKnow: undefined,
}

let currentPos = 0;

export default function QAPage({ setId }: InferProps<QAPageProps>) {
    const cardIds = getSetById(setId).cardIds;
    const [cardInfo, setCardInfo] = useState<CardInfo>(getCardById(cardIds[0]));
    const [pageState, setPageState] = useState<QAPageState>(defaultPageState);
    const cardRef = useRef<HTMLDivElement>(null);

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
            currentPos++;
            if (currentPos >= cardIds.length) {
                currentPos = 0;
            }
            setCardInfo(getCardById(cardIds[currentPos]));
            setTimeout(() => {
                cardRef.current?.classList.remove('isReduce', 'isFlipped');
                setPageState(defaultPageState);
            }, 100);
        }, 750);
    }

    return (
        <div className='QAPage'>
            <QACard ref={cardRef} cardInfo={cardInfo} />
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
    );
}