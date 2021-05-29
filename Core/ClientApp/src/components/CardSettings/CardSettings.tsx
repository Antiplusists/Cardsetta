import './CardSettings.css'
import { ChangeEvent, useRef, useState } from 'react';
import { FileObject } from 'material-ui-dropzone'
import { Card } from '../Card/Card'
import { Link, Redirect } from 'react-router-dom';
import { ButtonLink } from '../CustomButtons/ButtonLink'
import { CardEntity } from "../../entities/Card";
import ImageDropzone from '../ImageDropzone/ImageDropzone';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { CardWordValidators } from '../../validators/Validators';
import { CardWordErrorMessages } from '../../validators/ErrorMessage';

type CardSettingsProps = {
    card: CardEntity,
    deckId: string,
    onSave?: Function,
}

export default function CardSettings(props: CardSettingsProps) {
    const { card, deckId, onSave } = props;

    const [cardState, setCardState] = useState<CardEntity>(card);
    const [isSubmit, setIsSubmit] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const file = useRef<File>();

    async function handleSave() {
        if (onSave) {
            await onSave(cardState, file.current);
        }
        setIsSubmit(true);
    }

    function handleAddImage(files: FileObject[]) {
        setCardState({ ...cardState, imagePath: files[0].data?.toString() });
        file.current = files[0].file;
    }

    return (
        isSubmit
            ?
            <Redirect to={`/cards-preview/${deckId}`} />
            :
            <div className='settingsBlock'>
                <ValidatorForm className='part1' onSubmit={handleSave} instantValidate={false}>
                    <TextValidator label='Слово' variant='outlined' type='text' name='word'
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setCardState({ ...cardState, question: e.target.value })}
                        value={cardState.question}
                        validators={CardWordValidators}
                        errorMessages={CardWordErrorMessages}
                    />
                    <TextValidator label='Перевод' variant='outlined' type='text' name='translation'
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setCardState({ ...cardState, answer: e.target.value })}
                        value={cardState.answer}
                        validators={CardWordValidators}
                        errorMessages={CardWordErrorMessages}
                    />
                    <ImageDropzone onAddImage={handleAddImage} />
                    <ButtonLink className='buttonLink' type='submit' fixTabIndex={false}>
                        <p>Сохранить</p>
                    </ButtonLink>
                    <ButtonLink className='buttonLink'>
                        <Link to={`/cards-preview/${deckId}`}>Отмена</Link>
                    </ButtonLink>
                </ValidatorForm>
                <div className='part2'>
                    <Card ref={cardRef} card={cardState}
                        onClick={() => cardRef.current?.classList.toggle('isFlipped')} />
                </div>
            </div >
    );
}