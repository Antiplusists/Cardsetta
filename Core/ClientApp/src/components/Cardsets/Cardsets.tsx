import './Cardsets.css';
import { CircularProgress } from '@material-ui/core';
import PreviewCardsets from '../PreviewCardsets/PreviewCardsets';
import Deck from '../../entities/Deck';

type CardsetsProps = {
    isLoading?: boolean,
    isNotFound?: boolean,
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
        <div className={`${getGridClass()}`}>
            {decks.length === 0 && !isLoading || isNotFound && !isLoading
                ? <div className='centerText'>Наборов еще нет</div>
                : null
            } 
            {isLoading
                ? <CircularProgress className='loader' size={100} />
                : decks.map(deck => <PreviewCardsets key={deck.id} {...deck} />)
            }
        </div>
    );
}
