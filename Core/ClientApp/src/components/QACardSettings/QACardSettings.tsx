import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { InferProps } from 'prop-types';
import { TextField } from '@material-ui/core'
import { FileObject } from 'material-ui-dropzone'
import { QACard } from '../QACard/QACard'
import './QACardSettings.css'
import useQuery from '../../customHooks/useQuery';
import { Link, Redirect } from 'react-router-dom';
import { ButtonLink } from '../CustomButtons/ButtonLink'
import { Card } from "../../entities/Card";
import { ApiPaths } from "../api-authorization/ApiAuthorizationConstants";
import CardPatcher from "../../patchHelpers/CardPatcher";
import authService from "../api-authorization/AuthorizeService";
import ImageDropzone from '../ImageDropzone/ImageDropzone';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { CardWordValidators } from '../../validators/Validators';
import { CardWordErrorMessages } from '../../validators/ErrorMessage';

type QACardSettingsProps = {
    cardId: string;
}

export default function QACardSettings({ cardId }: InferProps<QACardSettingsProps>) {
    const query = useQuery();
    const deckId = query.get('cardset');

    const [cardInfo, setCardInfo] = useState<Card>({} as Card);
    const [isSubmit, setIsSubmit] = useState(false);
    const sourceCard = useRef({} as Card);
    const cardRef = useRef<HTMLDivElement>(null);

    const getCard = async () => {
        const response = await fetch(ApiPaths.cards.byId(deckId!, cardId));

        switch (response.status) {
            case 200: break;
            case 404: throw new Error(`Deck ${deckId} or card ${cardId} in deck is not exist`);
            default: throw new Error(`Can not fetch ${ApiPaths.cards.byId(deckId!, cardId)}`);
        }

        return await response.json() as Card;
    };

    useEffect(() => {
        getCard()
            .then(card => {
                setCardInfo(card);
                sourceCard.current = card;
            });
    }, []);

    const patch = async () => {
        const patchBuilder = new CardPatcher();
        if (sourceCard.current.answer !== cardInfo.answer) {
            patchBuilder.patchAnswer(cardInfo.answer);
        }
        if (sourceCard.current.question !== cardInfo.question)
            patchBuilder.patchQuestion(cardInfo.question);

        const body: RequestInit = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify(patchBuilder.build())
        };

        if (patchBuilder.build().length === 0) return;

        authService.addAuthorizationHeader(body);
        const response = await fetch(ApiPaths.cards.byId(deckId!, cardId), body);

        switch (response.status) {
            case 204: break;
            case 401: throw new Error(response.statusText);
            case 404: throw new Error(`Deck ${deckId} or card ${cardId} in deck is not exists`);
            case 422: throw new Error(`Invalid data`);
            default: throw new Error(`Can not fetch ${ApiPaths.cards.byId(deckId!, cardId)}`);
        }
    }

    const updateImage = async () => {
        if (sourceCard.current.imagePath !== cardInfo.imagePath) {
            //TODO: надо вытащить файл и положить в formData
        }
    }

    async function handleSave() {
        setIsSubmit(true);
        await patch();
        await updateImage();
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