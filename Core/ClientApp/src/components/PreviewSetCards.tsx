import PropTypes, { InferProps } from 'prop-types';
import { Link } from 'react-router-dom';
import { Link as NavLink } from '@material-ui/core';
import './PreviewSetCards.css';

export default function PreviewSetCards({ imgPreview }
  : InferProps<typeof PreviewSetCards.propTypes>) {
  return (
    <div>
      <div className='previewSetCard'>
        <img src={imgPreview ? imgPreview : ''} alt='preview'></img>
        <div className='overlay'>
          <NavLink className='linkButton' component={Link} to="/cards">START</NavLink>
          <NavLink className='linkButton'>FREE</NavLink>
          <NavLink className='linkButton' component={Link} to="/cards-preview">CARDS</NavLink>
        </div>
      </div>
    </div>
  );
}

PreviewSetCards.propTypes = {
  imgPreview: PropTypes.string,
};