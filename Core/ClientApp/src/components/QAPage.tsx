import { useState } from 'react';
import { Button } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import './QAPage.css';
import { CardInfo } from '../types/CardInfo'

const useStyles = makeStyles(() =>
    createStyles({
        answerButton: {
            margin: '40px 20px',
            width: '200px',
            height: '75px',
            fontWeight: 'bold',
            fontSize: 'x-large',
        },
    }));

type QACardState = {
    isFlipped: boolean,
    isReduce: boolean,
    isKnow: boolean | undefined
}

const defaultCardState = {
    isFlipped: false,
    isReduce: false,
    isKnow: undefined
}

const cards: CardInfo[] = [
    {
        questionImg: 'images/forTest/tree.png',
        questionText: 'Tree',
        answearText: 'Дерево'
    },
    {
        questionImg: 'images/forTest/tree_2.png',
        questionText: 'Real tree',
        answearText: 'Настоящее дерево'
    },
    {
        questionText: 'House',
        answearText: 'Жилой дом'
    }
]

let currentCardId = 0;

export default function QAPage() {
    const classes = useStyles();
    const [cardInfo, setCardInfo] = useState<CardInfo>(cards[0]);
    const [cardState, setCardState] = useState<QACardState>(defaultCardState);

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
            currentCardId++;
            if (currentCardId >= cards.length) {
                currentCardId = 0;
            }
            setCardInfo(cards[currentCardId]);
            setTimeout(() => setCardState(defaultCardState), 100);
        }, 1000);
    }

    return (
        <div className='page'>
            <div className={`QACard ${cardState.isFlipped ? 'isFlipped' : ''} ${cardState.isReduce ? 'isReduce' : ''}`}>
                <div className='sideQACard'>
                    {cardInfo.questionImg !== undefined ? <img src={cardInfo.questionImg} alt='questionImage' /> : ""}
                    <span>{cardInfo.questionText}</span>
                </div>
                <div className='sideQACard back'>
                    <span>{cardInfo.answearText}</span>
                </div>
            </div>
            <div >
                {cardState.isKnow !== false
                    ?
                    <div>
                        <Button className={classes.answerButton}
                            variant='contained' color='primary' onClick={() => chooseAnswer(true)}>
                            Знаю
                        </Button>
                        <Button className={classes.answerButton}
                            variant='contained' color='primary' onClick={() => chooseAnswer(false)}>
                            Не знаю
                        </Button>
                    </div>
                    :
                    <Button className={classes.answerButton}
                        variant='contained' color='primary' onClick={() => chooseAnswer(undefined)}>
                        Продолжить
                    </Button>
                }
            </div>
        </div>
    );
}