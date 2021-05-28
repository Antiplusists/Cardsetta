import { useRef } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../entities/Card";
import { ButtonLink } from "../CustomButtons/ButtonLink";
import { DeleteButton } from "../CustomButtons/DeleteButton";

type CardPreviewProps = {
    deckId: string,
    card: Card,
    onDelete: (cardId: string) => void,
    isAuth: boolean
}

export default function CardPreview({ card, onDelete, deckId, isAuth }: CardPreviewProps) {
    const blockRef = useRef<HTMLDivElement>(null);

    const getOverlay = () => {
        return (
            <div className='overlay'>
                <ButtonLink className='buttonLink'>
                    <Link to={`/card-settings/${card.id}?cardset=${deckId}`}>Изменить</Link>
                </ButtonLink>
                <DeleteButton refComponentForDelete={blockRef}
                    onClick={() => onDelete(card.id)}
                    warningMessage='Вы действительно хотите удалить данную карточку?' />
            </div>
        );
    }

    return (
        <div ref={blockRef} className='QAcardPreview'>
            <div className='sideQACard'>
                {card.imagePath ? <img src={card.imagePath} alt='questionImage' /> : ''}
                <span>{card.question}</span>
            </div>
            <div className='sideQACard'>
                <span>{card.answer}</span>
            </div>
            {isAuth ? getOverlay() : null}
        </div>
    );
}