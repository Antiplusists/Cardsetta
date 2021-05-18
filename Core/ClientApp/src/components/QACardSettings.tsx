import { useRef, useState } from 'react';
import { InferProps } from 'prop-types';
import { CardInfo } from '../types/CardInfo';
import { TextField, Button } from '@material-ui/core'
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone'
import { QACard } from './QACard'
import './QACardSettings.css'
import { Cards } from '../fakeCards'

export default function QACardSettings({ id, questionImg, questionText, answearText }: InferProps<CardInfo>) {
    const [cardInfo, setCardInfo] = useState<CardInfo>({ id, questionImg, questionText, answearText });
    const cardRef = useRef<HTMLDivElement>(null);

    function handleSave() {
        Cards[cardInfo.id] = cardInfo;
    }

    function handleAddImage(files: FileObject[]) {
        setCardInfo({ ...cardInfo, questionImg: files[0].data?.toString() });
    }

    return (    
        <div className='settingsBlock'>
            <div className='inputsBlock'>
                <TextField label='Слово' variant='outlined' defaultValue={questionText}
                    onChange={(e) => setCardInfo({ ...cardInfo, questionText: e.target.value })} />
                <TextField label='Перевод' variant='outlined' defaultValue={answearText}
                    onChange={(e) => setCardInfo({ ...cardInfo, answearText: e.target.value })} />
                <DropzoneAreaBase fileObjects={[]}
                    acceptedFiles={['image/*']}
                    filesLimit={1}
                    maxFileSize={1000000}
                    showPreviewsInDropzone={false}
                    onAdd={handleAddImage}
                    dropzoneText='Загрузить изображение'               
                    getFileAddedMessage={(fileName: String) => `Файл ${fileName} успешно добавлен.`}
                    getFileLimitExceedMessage={(filesLimit: number) => `Превышено максимально допустимое количество файлов. Разрешено только ${filesLimit}.`}
                    getDropRejectMessage={(rejectedFile: File) => `Файл ${rejectedFile.name} был отклонен.`}
                    getFileRemovedMessage={(fileName: String) => `Файл ${fileName} был удалён.`}
                />
                <Button variant='contained' color='primary' onClick={handleSave}>Сохранить</Button>
            </div>
            <QACard ref={cardRef} cardInfo={cardInfo} onClick={() => cardRef.current?.classList.toggle('isFlipped')} />
        </div >
    );
}