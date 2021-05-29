import './Decks.css';
import DecksPreview from '../DecksPreview/DecksPreview';
import DeckEntity from '../../entities/Deck';
import LoaderLayout from '../LoaderLayout/LoaderLayout';

type DecksProps = {
    isLoading: boolean,
    isNotFound: boolean,
    decks: DeckEntity[],
    onDelete?: (deckId: string) => void,
}

export default function Decks(props: DecksProps) {
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
            {decks.map(deck => <DecksPreview key={deck.id} deck={deck} onDelete={onDelete} />)}
        </LoaderLayout>
    );
}
