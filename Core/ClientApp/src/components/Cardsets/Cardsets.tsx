import './Cardsets.css';
import { CircularProgress } from '@material-ui/core';
import PreviewCardsets from '../PreviewCardsets/PreviewCardsets';
import Deck from '../../entities/Deck';
import React from 'react';
import LoaderLayout from '../LoaderLayout/LoaderLayout';

type CardsetsProps = {
    isLoading: boolean,
    isNotFound: boolean,
    decks: Deck[],
}

export default function Cardsets(props: CardsetsProps) {
    const { decks, isLoading, isNotFound } = props;
    const getGridClass = () => {
        if (decks.length === 1 || decks.length === 2) {
            return `previews g${decks.length}`;
        }
        return 'previews';
    }
    return (
        <LoaderLayout className={`${getGridClass()}`} isLoading={isLoading} isNotFound={isNotFound}
            componentNotFound={<div className='centerText'>Наборов еще нет</div>}>
            {decks.map(deck => <PreviewCardsets key={deck.id} {...deck} />)}
        </LoaderLayout>
    );
}
