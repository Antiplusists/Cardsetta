import { InferProps } from 'prop-types';
import { Link } from 'react-router-dom';
import { Link as NavLink } from '@material-ui/core';
import './PreviewSetCards.css';

type PreviewSetCardsProps = {
  imgPreview: string,
  setId: number,
}

export default function PreviewSetCards({ imgPreview, setId }
  : InferProps<PreviewSetCardsProps>) {
  return (
    <div>
      <div className='previewSetCard'>
        <img src={imgPreview ? imgPreview : ''} alt='preview'></img>
        <div className='overlay'>
          <NavLink className='linkButton' component={Link} to={'/cards/' + setId}>START</NavLink>
          <NavLink className='linkButton'>FREE</NavLink>
          <NavLink className='linkButton' component={Link} to={'/cards-preview/' + setId}>CARDS</NavLink>
        </div>
      </div>
    </div>
  );
}