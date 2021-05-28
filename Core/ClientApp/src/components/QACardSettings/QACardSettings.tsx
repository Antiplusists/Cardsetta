import './QACardSettings.css'
import { ChangeEvent, useRef, useState } from 'react';
import { FileObject } from 'material-ui-dropzone'
import { QACard } from '../QACard/QACard'
import { Link, Redirect } from 'react-router-dom';
import { ButtonLink } from '../CustomButtons/ButtonLink'
import { Card } from "../../entities/Card";
import ImageDropzone from '../ImageDropzone/ImageDropzone';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { CardWordValidators } from '../../validators/Validators';
import { CardWordErrorMessages } from '../../validators/ErrorMessage';

type QACardSettingsProps = {
    card: Card,
    deckId: string,
    onSave?: Function,
}

export default function QACardSettings(props: QACardSettingsProps) {
    const { card, deckId, onSave } = props;

    const [cardState, setCardState] = useState<Card>(card);
    const [isSubmit, setIsSubmit] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    async function handleSave() {
        if (onSave) {
            await onSave(cardState);
        }
        setIsSubmit(true);
    }

    function handleAddImage(files: FileObject[]) {
        setCardState({ ...cardState, imagePath: files[0].data?.toString() });
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
                    <QACard ref={cardRef} cardInfo={cardState}
                        onClick={() => cardRef.current?.classList.toggle('isFlipped')} />
                </div>
            </div >
    );
}