import { InferProps } from 'prop-types';
import { Link } from 'react-router-dom';
import './PreviewSetCards.css';
import { ButtonLink } from '../ButtonLink/ButtonLink';
import { getSetById } from '../../fakeRepository/fakeSets';
import { CardsetInfo } from '../../types/CardsetInfo';

export default function PreviewSetCards({ id, image, name, description }
  : InferProps<CardsetInfo>) {
  const cardset = getSetById(id);
  return (
    <div>
      <div className='previewSetCard flexCenter'>
        {
          cardset.image && cardset.image !== ''
            ?
            <img src={cardset.image} alt='preview' />
            :
            <div className='textBlock'>
              <h1 className='name'>{cardset.name}</h1>
              <p>{cardset.description}</p>
            </div>
        }
        <div className='overlay'>
          <ButtonLink className='buttonLink'>
            <Link to={`/cards/${id}`}>Начать</Link>
          </ButtonLink>
          <ButtonLink className='buttonLink'>
            <Link to={'/'}>SOON</Link>
          </ButtonLink>
          <ButtonLink className='buttonLink'>
            <Link to={`/cards-preview/${id}`}>Превью</Link>
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}