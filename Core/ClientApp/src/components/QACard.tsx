import { InferProps } from 'prop-types';
import { CardInfo } from '../types/CardInfo'
import './QACard.css';

interface QACardProps {
    cardInfo: CardInfo,
    isFlipped?: boolean,
    isReduce?: boolean,
    onClick?: Function,
}

export default function QACard({ cardInfo, isFlipped, isReduce, onClick }: InferProps<QACardProps>) {
    return (
        <div onClick={onClick} className={`QACard 
            ${isFlipped ? 'isFlipped' : ''} 
            ${isReduce ? 'isReduce' : ''}
            ${onClick ? 'isClick' : ''}`}>
            <div className='sideQACard'>
                {cardInfo.questionImg !== undefined ? <img src={cardInfo.questionImg} alt='questionImage' /> : ''}
                <span>{cardInfo.questionText}</span>
            </div>
            <div className='sideQACard back'>
                <span>{cardInfo.answearText}</span>
            </div>
        </div>
    );
}