import './DecksPreview.css';
import { Link } from 'react-router-dom';
import { ButtonLink } from '../CustomButtons/ButtonLink';
import { DeleteButton } from '../CustomButtons/DeleteButton';
import DeckEntity from '../../entities/Deck';
import { useRef } from 'react';
import authService from '../api-authorization/AuthorizeService';

type DeckPreviewProps = {
  deck: DeckEntity,
  onDelete?: (deckId: string) => void,
}

export default function DecksPreview(props: DeckPreviewProps) {
  const { deck, onDelete } = props;
  const blockRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={blockRef} className='previewSetCard flexCenter'>
        {deck.imagePath
          ?
          <img src={deck.imagePath} alt='preview' />
          :
          <div className='textBlock'>
            <h1 className='name'>{deck.name}</h1>
            <p>{deck.description}</p>
          </div>
        }
        <div className='overlay'>
          {authService.isAuthenticated()
            ?
            <ButtonLink className='buttonLink'>
              <Link to={`/cards/${deck.id}`}>Начать</Link>
            </ButtonLink>
            : null
          }
          <ButtonLink className='buttonLink'>
            <Link to={`/cards-endless/${deck.id}`}>Endless</Link>
          </ButtonLink>
          <ButtonLink className='buttonLink'>
            <Link to={`/cards-preview/${deck.id}`}>Превью</Link>
          </ButtonLink>
          {onDelete && authService.getUser()?.id === deck.authorId
            ?
            <DeleteButton refComponentForDelete={blockRef}
              onClick={() => onDelete(deck.id)}
              warningMessage='Вы действительно хотите удалить данный набор?' />
            : null
          }
        </div>
      </div>
    </div>
  );
}