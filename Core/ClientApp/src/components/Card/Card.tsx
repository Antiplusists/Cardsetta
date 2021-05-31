import './Card.css';
import React, { MouseEventHandler } from 'react';
import { CardEntity } from "../../entities/Card";

interface CardProps {
    card: CardEntity,
    onClick?: MouseEventHandler<HTMLDivElement>,
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ card, onClick }, ref) => {
        return (
            <div ref={ref} className={`Card`}
                onClick={onClick}
                style={onClick ? { cursor: 'pointer' } : {}}>
                <div className='sideCard'>
                    {card.imagePath ? <img src={card.imagePath} alt='questionImage' /> : ''}
                    <span>{card.question}</span>
                </div>
                <div className='sideCard back'>
                    <span>{card.answer}</span>
                </div>
            </div>
        );
    }
);