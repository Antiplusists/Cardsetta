import './DecksPreview.css';
import { Link } from 'react-router-dom';
import { ButtonLink } from '../CustomButtons/ButtonLink';
import { DeleteButton } from '../CustomButtons/DeleteButton';
import DeckEntity from '../../entities/Deck';
import { useRef } from 'react';
import authService from '../api-authorization/AuthorizeService';
import { Chip } from '@material-ui/core';

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
        <div className='tags'>
          {deck.tags.map((t, i) => <Chip key={i} label={t} size='small'
            style={{ backgroundColor: stringToHSL(t) }} />)}
        </div>
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
              <Link to={`/cards/${deck.id}`}>Базовый</Link>
            </ButtonLink>
            : null
          }
          <ButtonLink className='buttonLink'>
            <Link to={`/cards-endless/${deck.id}`}
              style={{ fontSize: '40px' }}>
              Бесконечный
            </Link>
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

const stringToHSL = (str: string) => {
  let h: number, s: number, l: number;
  const opts = {
    hue: [0, 360],
    sat: [75, 100],
    lit: [70, 90]
  };

  const range = (hash: number, min: number, max: number) => {
    var diff = max - min;
    var x = ((hash % diff) + diff) % diff;
    return x + min;
  };

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  h = range(hash, opts.hue[0], opts.hue[1]);
  s = range(hash, opts.sat[0], opts.sat[1]);
  l = range(hash, opts.lit[0], opts.lit[1]);

  return `hsl(${h}, ${s}%, ${l}%)`;
}