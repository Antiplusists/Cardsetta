import './CardsetSettings.css';

import { useState } from 'react';
import { InferProps } from 'prop-types';
import { Button, TextField } from '@material-ui/core'
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone'
import { updateCardset } from '../../fakeRepository/fakeCardsets'
import { Link } from 'react-router-dom';
import { ButtonLink } from '../ButtonLink/ButtonLink'
import { CardsetInfo } from '../../types/CardsetInfo'

export default function CardsetSettings({ id, cardIds, name, description, image }: InferProps<CardsetInfo>) {
    const [cardset, setCardset] = useState<CardsetInfo>({ id, cardIds, name, description, image });

    function handleSave() {
        updateCardset(cardset);
    }

    function handleAddImage(files: FileObject[]) {
        setCardset({ ...cardset, image: files[0].data?.toString() });
    }

    function handleDeleteImage() {
        setCardset({ ...cardset, image: undefined });
    }

    return (
        <div className='settingsBlock'>
            <div className='part1'>
                <TextField label='Название' variant='outlined' defaultValue={name}
                    onChange={(e) => setCardset({ ...cardset, name: e.target.value })} />
                <TextField label='Описание' variant='outlined' defaultValue={description}
                    onChange={(e) => setCardset({ ...cardset, description: e.target.value })}
                    rows={5} rowsMax={5} multiline />

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
                    <Link to={`/cards-preview/${cardset.id}`}>Сохранить</Link>
                </ButtonLink>
                <ButtonLink className='buttonLink'>
                    <Link to={`/cards-preview/${cardset.id}`}>Отмена</Link>
                </ButtonLink>
            </div >
            <div className='part2'>
                <div className='previewCardsetBlock '>
                    <div className='previewCardset flexCenter'>
                        {  
                            cardset.image && cardset.image !== ''
                                ?
                                <img src={cardset.image} alt='preview' />
                                :
                                <div className='textBlock'>
                                    <h1 className='name'>{cardset.name}</h1>
                                    <p>{cardset.description}</p>
                                </div>
                        }
                    </div>
                    <div className='overlay'>
                        <Button className='deleteButton' onClick={handleDeleteImage}>
                            Удалить изображение
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
}