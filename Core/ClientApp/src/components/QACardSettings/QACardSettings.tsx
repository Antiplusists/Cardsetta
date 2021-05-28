import {useEffect, useRef, useState} from 'react';
import { InferProps } from 'prop-types';
import { TextField } from '@material-ui/core'
import { FileObject } from 'material-ui-dropzone'
import { QACard } from '../QACard/QACard'
import './QACardSettings.css'
import useQuery from '../../customHooks/useQuery';
import { Link } from 'react-router-dom';
import { ButtonLink } from '../CustomButtons/ButtonLink'
import {Card} from "../../entities/Card";
import {ApiPaths} from "../api-authorization/ApiAuthorizationConstants";
import CardPatcher from "../../patchHelpers/CardPatcher";
import authService from "../api-authorization/AuthorizeService";
import ImageDropzone from '../ImageDropzone/ImageDropzone';

type QACardSettingsProps = {
    cardId: string;
}

export default function QACardSettings({cardId} : InferProps<QACardSettingsProps>)  {
    const query = useQuery();
    const deckId = query.get('cardset');
    
    const [cardInfo, setCardInfo] = useState<Card>({} as Card);
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
            .then(card =>{
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
        if (sourceCard.current.imagePath !== cardInfo.imagePath)
        {
            //TODO: надо вытащить файл и положить в formData
        }
    }
    
    async function handleSave() {
        await patch();
        await updateImage();
    }

    function handleAddImage(files: FileObject[]) {
        setCardInfo({ ...cardInfo, imagePath: files[0].data?.toString() });
    }
    
    return (
        <div className='settingsBlock'>
            <div className='part1'>
                <TextField label='Слово' variant='outlined' value={cardInfo.question || ''}
                           onChange={(e) => setCardInfo({ ...cardInfo, question: e.target.value })} />
                <TextField label='Перевод' variant='outlined' value={cardInfo.answer || ''}
                           onChange={(e) => setCardInfo({ ...cardInfo, answer: e.target.value })} />
                <ImageDropzone onAddImage={handleAddImage}/>           
                <ButtonLink className='buttonLink' onClick={handleSave}>
                    <Link to={`/cards-preview/${deckId}`}>Сохранить</Link>
                </ButtonLink>
                <ButtonLink className='buttonLink'>
                    <Link to={`/cards-preview/${deckId}`}>Отмена</Link>
                </ButtonLink>
            </div>
            <div className='part2'>
                <QACard ref={cardRef} cardInfo={cardInfo}
                        onClick={() => cardRef.current?.classList.toggle('isFlipped')} />
            </div>
        </div >
    );
}