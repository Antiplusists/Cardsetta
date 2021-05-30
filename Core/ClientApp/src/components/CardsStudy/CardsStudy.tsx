import './CardsStudy.css';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Fab, TextField } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { Card } from '../Card/Card'
import { CardEntity } from "../../entities/Card";

type CardsStudyState = {
    isKnow: boolean | undefined,
    isWaiting: boolean,
    answerValue: string,
}

type CardsStudyProps = {
    cards: CardEntity[],
    onTrue?: (cardId: string) => void,
    onFalse?: (cardId: string) => void,
    onEnd?: Function,
}

const defaultCardsStudyState: CardsStudyState = {
    isKnow: undefined,
    isWaiting: true,
    answerValue: '',
}

const randomCards = (cards: CardEntity[]) => {
    let copyOfCards = [...cards];
    return (): CardEntity | null => {
        if (copyOfCards.length === 0) {
            return null;
        }
        const card = copyOfCards[Math.floor(Math.random() * copyOfCards.length)];
        copyOfCards = copyOfCards.filter(c => c.id != card.id);
        return card;
    }
}

export default function CardsStudy(props: CardsStudyProps) {
    const { cards, onTrue, onFalse, onEnd } = props;

    const [pageState, setPageState] = useState<CardsStudyState>(defaultCardsStudyState);
    const cardRef = useRef<HTMLDivElement>(null);

    const getNextCard = useRef(randomCards(cards));
    const [currentCard, setCurrentCard] = useState<CardEntity | null>(null);

    useEffect(() => setCurrentCard(getNextCard.current()), []);

    function chooseAnswer(isKnow: boolean) {
        if (!isKnow) {
            setPageState({ ...pageState, isWaiting: false });
            cardRef.current?.classList.add('isFlipped');
            if (onFalse) {
                onFalse(currentCard!.id);
            }
            setTimeout(() => setPageState({ ...pageState, isKnow, isWaiting: true }), 750);
        }
        else setPageState({ ...pageState, isKnow });
    }

    function checkAnswer(answer: string) {
        setPageState({ ...pageState, isWaiting: false });
        cardRef.current?.classList.add('isFlipped');

        if (currentCard!.answer.toLowerCase() !== answer.toLowerCase()) {
            if (onFalse) {
                onFalse(currentCard!.id);
            }
            setTimeout(() =>
                setPageState({ ...pageState, isKnow: false, isWaiting: true })
                , 750);
            return;
        }

        if (onTrue) {
            onTrue(currentCard!.id);
        }

        setTimeout(() => {
            moveNextCard();
        }, 1500);
    }

    function moveNextCard() {
        setPageState({ ...pageState, isWaiting: false });
        cardRef.current?.classList.add('isReduce');

        setTimeout(() => {
            const nextCard = getNextCard.current();
            if (!nextCard) {
                if (onEnd) {
                    onEnd();
                    return;
                }
                getNextCard.current = randomCards(cards);
                setCurrentCard(getNextCard.current());
            }
            else setCurrentCard(nextCard);
            cardRef.current?.classList.remove('isReduce', 'isFlipped');
            setTimeout(() => setPageState(defaultCardsStudyState), 750);
        }, 750);
    }

    return (
        <div className='CardsStudy'>
            {currentCard ? <Card ref={cardRef} card={currentCard} /> : null}
            {pageState.isWaiting
                ?
                <Fragment>
                    {pageState.isKnow === undefined
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
                        pageState.isKnow
                            ?
                            <div className='flexCenter'>
                                <TextField className='answerButton' variant='outlined' color='primary'
                                    value={pageState.answerValue} autoFocus placeholder='Ответ'
                                    InputProps={{ style: { backgroundColor: 'white' } }}
                                    onChange={e => setPageState({ ...pageState, answerValue: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' ? checkAnswer(pageState.answerValue) : null} />
                                <Fab className='checkButton' color='primary'
                                    onClick={() => checkAnswer(pageState.answerValue)}>
                                    <Send />
                                </Fab>
                            </div>
                            :
                            <Button className='answerButton'
                                variant='contained' color='primary' onClick={moveNextCard}>
                                Продолжить
                            </Button>
                    }
                </Fragment>
                : null}
        </div>
    );
}