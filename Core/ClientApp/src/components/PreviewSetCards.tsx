import { InferProps } from 'prop-types';
import { Link } from 'react-router-dom';
import './PreviewSetCards.css';
import { ButtonLink } from './ButtonLink';

type PreviewSetCardsProps = {
  imgPreview: string,
  setId: string,
}

export default function PreviewSetCards({ imgPreview, setId }
  : InferProps<PreviewSetCardsProps>) {
  return (
    <div>
      <div className='previewSetCard'>
        <img src={imgPreview ? imgPreview : ''} alt='preview'></img>
        <div className='overlay'>
          <ButtonLink className='buttonLink'>
            <Link to={'/cards/' + setId}>Начать</Link>
          </ButtonLink>
          <ButtonLink className='buttonLink'>
            <Link to={'/'}>SOON</Link>
          </ButtonLink>
          <ButtonLink className='buttonLink'>
            <Link to={'/cards-preview/' + setId}>Превью</Link>
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}