import React, { MouseEventHandler } from 'react';
import './QACard.css';
import {Card} from "../../entities/Card";

interface QACardProps {
    cardInfo: Card,
    onClick?: MouseEventHandler<HTMLDivElement>,
}

export const QACard = React.forwardRef<HTMLDivElement, QACardProps>(
    ({ cardInfo, onClick }, ref) => {
        return (
            <div ref={ref} className={`QACard`}
                onClick={onClick}
                style={onClick ? { cursor: 'pointer' } : {}}>
                <div className='sideQACard'>
                    {cardInfo.imagePath ? <img src={cardInfo.imagePath} alt='questionImage' /> : ''}
                    <span>{cardInfo.question}</span>
                </div>
                <div className='sideQACard back'>
                    <span>{cardInfo.answer}</span>
                </div>
            </div>
        );
    }
);