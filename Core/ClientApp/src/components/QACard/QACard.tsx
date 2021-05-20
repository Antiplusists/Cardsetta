import React, { MouseEventHandler } from 'react';
import { CardInfo } from '../../types/CardInfo'
import './QACard.css';

interface QACardProps {
    cardInfo: CardInfo,
    onClick?: MouseEventHandler<HTMLDivElement>,
}

export const QACard = React.forwardRef<HTMLDivElement, QACardProps>(
    ({ cardInfo, onClick }, ref) => {
        return (
            <div ref={ref} className={`QACard`}
                onClick={onClick}
                style={onClick ? { cursor: 'pointer' } : {}}>
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
);