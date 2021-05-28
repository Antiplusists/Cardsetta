import {useRef, useState} from 'react';
import {TextField} from '@material-ui/core'
import {DropzoneAreaBase, FileObject} from 'material-ui-dropzone'
import {QACard} from '../QACard/QACard'
import './QACardCreation.css'
import useQuery from '../../customHooks/useQuery';
import {Link} from 'react-router-dom';
import {ButtonLink} from '../CustomButtons/ButtonLink'
import {Card, CardType} from "../../entities/Card";
import {ApiPaths} from "../api-authorization/ApiAuthorizationConstants";
import authService from "../api-authorization/AuthorizeService";

export default function QACardCreation()  {
    const query = useQuery();
    const deckId = query.get('cardset');
    
    const [cardInfo, setCardInfo] = useState<Card>({type: CardType.Text} as Card);
    const cardRef = useRef<HTMLDivElement>(null);
    
    async function handleSave() {
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
        <div className='settingsBlock'>
            <div className='part1'>
                <TextField label='Слово' variant='outlined' value={cardInfo.question || ''}
                           onChange={(e) => setCardInfo({ ...cardInfo, question: e.target.value })} />
                <TextField label='Перевод' variant='outlined' value={cardInfo.answer || ''}
                           onChange={(e) => setCardInfo({ ...cardInfo, answer: e.target.value })} />
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