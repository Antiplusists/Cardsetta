import { useRef, useState } from 'react';
import { InferProps } from 'prop-types';
import { Button } from '@material-ui/core';
import { CardInfo } from '../../types/CardInfo'
import { QACard } from '../QACard/QACard'
import { getCardsetById } from '../../fakeRepository/fakeCardsets'
import { getCardById } from '../../fakeRepository/fakeCards'
import './QAPage.css';

type QAPageState = {
    isKnow: boolean | undefined,
}

type QAPageProps = {
    cardsetId: string,
}

const defaultPageState: QAPageState = {
    isKnow: undefined,
}

export default function QAPage({ cardsetId }: InferProps<QAPageProps>) {
    const cardIds = getCardsetById(cardsetId).cardIds;
    const [position, setPosition] = useState<number>(0);
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
            if (position + 1 >= cardIds.length) {
                setPosition(0);
            }
            else setPosition(position + 1);
            setTimeout(() => {
                cardRef.current?.classList.remove('isReduce', 'isFlipped');
                setPageState(defaultPageState);
            }, 100);
        }, 750);
    }

    return (
        <div className='QAPage'>
            <QACard ref={cardRef} cardInfo={getCardById(cardIds[position])} />
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