import { getAllCardsets } from '../../fakeRepository/fakeCardsets';
import PreviewCardsets from '../PreviewCardsets/PreviewCardsets';
import './Cardsets.css';

export default function MainCardsets() {
  return (
    <div className='previews'>
      {getAllCardsets().map(cardset =>
        <PreviewCardsets key={cardset.id} {...cardset} />
      )}
    </div>
  );
}