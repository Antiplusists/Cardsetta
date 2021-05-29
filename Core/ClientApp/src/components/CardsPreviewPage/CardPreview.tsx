import { useRef } from "react";
import { Link } from "react-router-dom";
import { CardEntity } from "../../entities/Card";
import { ButtonLink } from "../CustomButtons/ButtonLink";
import { DeleteButton } from "../CustomButtons/DeleteButton";

type CardPreviewProps = {
    deckId: string,
    card: CardEntity,
    onDelete: (cardId: string) => void,
    isAuth: boolean
}

export default function CardPreview({ card, onDelete, deckId, isAuth }: CardPreviewProps) {
    const blockRef = useRef<HTMLDivElement>(null);

    const getOverlay = () => {
        return (
            <div className='overlay'>
                <ButtonLink className='buttonLink'>
                    <Link to={`/card-settings/${card.id}?deck=${deckId}`}>Изменить</Link>
                </ButtonLink>
                <DeleteButton refComponentForDelete={blockRef}
                    onClick={() => onDelete(card.id)}
                    warningMessage='Вы действительно хотите удалить данную карточку?' />
            </div>
        );
    }

    return (
        <div ref={blockRef} className='cardPreview flexCenter'>
            <div className='sideCard'>
                {card.imagePath ? <img src={card.imagePath} alt='questionImage' /> : ''}
                <span>{card.question}</span>
            </div>
            <div className='sideCard'>
                <span>{card.answer}</span>
            </div>
            {isAuth ? getOverlay() : null}
        </div>
    );
}