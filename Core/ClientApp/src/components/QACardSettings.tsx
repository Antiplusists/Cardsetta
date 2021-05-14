import { useState } from 'react';
import { InferProps } from 'prop-types';
import { CardInfo } from '../types/CardInfo';
import { TextField, Button } from '@material-ui/core'
import { DropzoneArea } from 'material-ui-dropzone'
import QACard from './QACard'
import './QACardSettings.css'
import { Cards } from '../fakeCards'

export default function QACardSettings({ id, questionImg, questionText, answearText }: InferProps<CardInfo>) {
    const [cardInfo, setCardInfo] = useState<CardInfo>({ id, questionImg, questionText, answearText });
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    function handleSave() {
        Cards[cardInfo.id] = cardInfo;
    }

    return (
        <div className='settingsBlock'>
            <div className='inputsBlock'>
                <TextField label='Слово' variant='outlined' defaultValue={questionText}
                    onChange={(e) => setCardInfo({ ...cardInfo, questionText: e.target.value })} />
                <TextField label='Перевод' variant='outlined' defaultValue={answearText}
                    onChange={(e) => setCardInfo({ ...cardInfo, answearText: e.target.value })} />
                {/* TODO: придумать что-то с загрузкой изображения */}
                <DropzoneArea
                    acceptedFiles={['image/*']}
                    filesLimit={1}
                    showPreviewsInDropzone={false}
                    dropzoneText='Загрузить изображение'
                />
                <Button variant='contained' color='primary' onClick={handleSave}>Сохранить</Button>
            </div>
            <QACard cardInfo={cardInfo} isFlipped={isFlipped} onClick={() => setIsFlipped(!isFlipped)}/>
        </div >
    );
}