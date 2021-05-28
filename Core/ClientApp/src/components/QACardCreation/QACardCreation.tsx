import React, { ChangeEvent, useRef, useState } from 'react';
import { TextField } from '@material-ui/core'
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone'
import { QACard } from '../QACard/QACard'
import useQuery from '../../customHooks/useQuery';
import { Link, Redirect } from 'react-router-dom';
import { ButtonLink } from '../CustomButtons/ButtonLink'
import { Card, CardType } from "../../entities/Card";
import { ApiPaths } from "../api-authorization/ApiAuthorizationConstants";
import authService from "../api-authorization/AuthorizeService";
import ImageDropzone from '../ImageDropzone/ImageDropzone';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { CardWordValidators } from '../../validators/Validators';
import { CardWordErrorMessages } from '../../validators/ErrorMessage';

export default function QACardCreation() {
    const query = useQuery();
    const deckId = query.get('cardset');

    const [cardInfo, setCardInfo] = useState<Card>({ type: CardType.Text } as Card);
    const [isSubmit, setIsSubmit] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    async function handleSave() {
        setIsSubmit(true);
        const formData = new FormData();
        formData.append('question', cardInfo.question);
        formData.append('answer', cardInfo.answer);
        formData.append('type', CardType[cardInfo.type]);
        //formData.append('image', ); TODO: как-то достать изображение
        const body = {
            method: 'POST',
            body: formData
        }
        authService.addAuthorizationHeader(body);

        const response = await fetch(ApiPaths.cards.default(deckId!), body);

        switch (response.status) {
            case 201: break;
            case 404: throw new Error(`Deck ${deckId} is not exist`);
            default: throw new Error(`Can not fetch ${ApiPaths.cards.default(deckId!)}`);
        }
    }

    function handleAddImage(files: FileObject[]) {
        setCardInfo({ ...cardInfo, imagePath: files[0].data?.toString() });
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
                            setCardInfo({ ...cardInfo, question: e.target.value })}
                        value={cardInfo.question || ''}
                        validators={CardWordValidators}
                        errorMessages={CardWordErrorMessages}
                    />
                    <TextValidator label='Перевод' variant='outlined' type='text' name='translation'
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setCardInfo({ ...cardInfo, answer: e.target.value })}
                        value={cardInfo.answer || ''}
                        validators={CardWordValidators}
                        errorMessages={CardWordErrorMessages}
                    />
                    <ImageDropzone onAddImage={handleAddImage} />
                    <ButtonLink className='buttonLink' type='submit'>
                        <a>Сохранить</a>
                    </ButtonLink>
                    <ButtonLink className='buttonLink'>
                        <Link to={`/cards-preview/${deckId}`}>Отмена</Link>
                    </ButtonLink>
                </ValidatorForm>
                <div className='part2'>
                    <QACard ref={cardRef} cardInfo={cardInfo}
                        onClick={() => cardRef.current?.classList.toggle('isFlipped')} />
                </div>
            </div >
    );
}