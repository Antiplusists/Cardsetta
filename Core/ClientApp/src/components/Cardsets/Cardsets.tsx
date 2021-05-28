import './Cardsets.css';
import PreviewCardsets from '../PreviewCardsets/PreviewCardsets';
import Deck from '../../entities/Deck';
import LoaderLayout from '../LoaderLayout/LoaderLayout';

type CardsetsProps = {
    isLoading: boolean,
    isNotFound: boolean,
    decks: Deck[],
    onDelete?: (deckId: string) => void,
}

export default function Cardsets(props: CardsetsProps) {
    const { decks, isLoading, isNotFound, onDelete } = props;
    const getGridClass = () => {
        if (decks.length === 1 || decks.length === 2) {
            return `previews g${decks.length}`;
        }
        return 'previews';
    }
    return (
        <LoaderLayout className={`${getGridClass()}`} isLoading={isLoading} isNotFound={isNotFound}
            componentNotFound={<div className='centerText'>Наборов еще нет</div>}>
            {decks.map(deck => <PreviewCardsets key={deck.id} deck={deck} onDelete={onDelete} />)}
        </LoaderLayout>
    );
}
