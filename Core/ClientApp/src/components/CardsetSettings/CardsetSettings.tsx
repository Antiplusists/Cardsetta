import './CardsetSettings.css';
import { useState } from 'react';
import { Button, TextField } from '@material-ui/core'
import { FileObject } from 'material-ui-dropzone'
import { Link } from 'react-router-dom';
import { ButtonLink } from '../ButtonLink/ButtonLink'
import Deck from '../../entities/Deck';
import ImageDropzone from '../ImageDropzone/ImageDropzone';

type CardsetSettingsProps = {
    deck: Deck,
    pathRedirect: string,
    onSave?: Function,
}

export default function CardsetSettings(props: CardsetSettingsProps) {
    const { deck, onSave, pathRedirect } = props;
    const [cardset, setCardset] = useState<Deck>(deck);

    function handleSave() {
        if (onSave) {
            onSave(cardset);
        }
    }

    function handleAddImage(files: FileObject[]) {
        setCardset({ ...cardset, imagePath: files[0].data?.toString() ?? '' });
    }

    function handleDeleteImage() {
        if (cardset.imagePath) {
            setCardset({ ...cardset, imagePath: '' });
        }
    }

    const DemoCardset = () => {
        return (<div className='previewCardsetBlock '>
            <div className='previewCardset flexCenter'>
                {cardset.imagePath
                    ?
                    <img src={cardset.imagePath} alt='preview' />
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
        </div>);
    }

    return (
        <div className='settingsBlock'>
            <div className='part1'>
                <TextField label='Название' variant='outlined' defaultValue={cardset.name}
                    onChange={(e) => setCardset({ ...cardset, name: e.target.value })} />
                <TextField label='Описание' variant='outlined' defaultValue={cardset.description}
                    onChange={(e) => setCardset({ ...cardset, description: e.target.value })}
                    rows={5} rowsMax={5} multiline />
                <ImageDropzone onAddImage={handleAddImage} />
                <ButtonLink className='buttonLink' onClick={handleSave}>
                    <Link to={pathRedirect}>Сохранить</Link>
                </ButtonLink>
                <ButtonLink className='buttonLink'>
                    <Link to={pathRedirect}>Отмена</Link>
                </ButtonLink>
            </div >
            <div className='part2'>
                <DemoCardset />
            </div>
        </div >
    );
}