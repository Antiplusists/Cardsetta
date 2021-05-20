import { InferProps } from 'prop-types';
import { Link } from 'react-router-dom';
import './PreviewCardsets.css';
import { ButtonLink } from '../ButtonLink/ButtonLink';
import { CardsetInfo } from '../../types/CardsetInfo';

export default function PreviewCardsets({ id, image, name, description }
  : InferProps<CardsetInfo>) {
  return (
    <div>
      <div className='previewSetCard flexCenter'>
        {
          image && image !== ''
            ?
            <img src={image} alt='preview' />
            :
            <div className='textBlock'>
              <h1 className='name'>{name}</h1>
              <p>{description}</p>
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