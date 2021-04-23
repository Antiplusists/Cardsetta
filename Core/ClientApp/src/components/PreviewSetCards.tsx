import PropTypes, { InferProps } from 'prop-types';
import { Link as NavLink } from '@material-ui/core';
import './PreviewSetCards.css';

export default function PreviewSetCards({ imgPreview }
  : InferProps<typeof PreviewSetCards.propTypes>) {
  return (
    <div>
      <div className='card'>
        <img src={imgPreview ? imgPreview : ''} alt='preview'></img>
        <div className='overlay'>
          <NavLink className='linkButton'>START</NavLink>
          <NavLink className='linkButton'>FREE</NavLink>
          <NavLink className='linkButton'>CARDS</NavLink>
        </div>
      </div>
    </div>
  );
}

PreviewSetCards.propTypes = {
  imgPreview: PropTypes.string,
};