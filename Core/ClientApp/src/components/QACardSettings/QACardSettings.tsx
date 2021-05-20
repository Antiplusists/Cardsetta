import { useRef, useState } from 'react';
import { InferProps } from 'prop-types';
import { CardInfo } from '../../types/CardInfo';
import { TextField } from '@material-ui/core'
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone'
import { QACard } from '../QACard/QACard'
import './QACardSettings.css'
import { setCard } from '../../fakeRepository/fakeCards'
import { containsCardInSet, getSetById } from '../../fakeRepository/fakeSets'
import useQuery from '../../customHooks/useQuery';
import { Link } from 'react-router-dom';
import { ButtonLink } from '../ButtonLink/ButtonLink'

export default function QACardSettings({ id, questionImg, questionText, answearText }: InferProps<CardInfo>) {
    const query = useQuery();
    const setId = query.get('set');

    const [cardInfo, setCardInfo] = useState<CardInfo>({ id, questionImg, questionText, answearText });
    const cardRef = useRef<HTMLDivElement>(null);

    function handleSave() {
        setCard(cardInfo);
        if (!setId) {
            return;
        }
        if (!containsCardInSet(setId, cardInfo.id)) {
            getSetById(setId).cardIds.push(cardInfo.id);
        }
    }

    function handleAddImage(files: FileObject[]) {
        setCardInfo({ ...cardInfo, questionImg: files[0].data?.toString() });
    }

    return (
        <div className='settingsBlock'>
            <div className='inputsBlock'>
                <TextField label='Слово' variant='outlined' defaultValue={cardInfo.questionText}
                    onChange={(e) => setCardInfo({ ...cardInfo, questionText: e.target.value })} />
                <TextField label='Перевод' variant='outlined' defaultValue={cardInfo.answearText}
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

                <ButtonLink className='buttonLink' onClick={handleSave}>
                    <Link to={`/cards-preview/${setId}`}>Сохранить</Link>
                </ButtonLink>
                <ButtonLink className='buttonLink'>
                    <Link to={`/cards-preview/${setId}`}>Отмена</Link>
                </ButtonLink>


            </div>
            <QACard ref={cardRef} cardInfo={cardInfo} onClick={() => cardRef.current?.classList.toggle('isFlipped')} />
        </div >
    );
}