import './CardsetSettings.css';
import { ChangeEvent, useState } from 'react';
import { Button } from '@material-ui/core'
import { FileObject } from 'material-ui-dropzone'
import { Link, Redirect } from 'react-router-dom';
import { ButtonLink } from '../CustomButtons/ButtonLink'
import Deck from '../../entities/Deck';
import ImageDropzone from '../ImageDropzone/ImageDropzone';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { DeckNameValidators, DeckDescriptionValidators } from '../../validators/Validators';
import { DeckNameErrorMessages, DeckDescriptionErrorMessages } from '../../validators/ErrorMessage';

type CardsetSettingsProps = {
    deck: Deck,
    pathRedirect: string,
    onSave?: Function,
}

export default function CardsetSettings(props: CardsetSettingsProps) {
    const { deck, onSave, pathRedirect } = props;
    const [cardset, setCardset] = useState<Deck>(deck);
    const [isSubmit, setIsSubmit] = useState(false);

    function handleSave() {
        if (onSave) {
            setIsSubmit(true);
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
        isSubmit
            ?
            <Redirect to={pathRedirect} />
            :
            <div className='settingsBlock'>
                <ValidatorForm className='part1' onSubmit={handleSave} instantValidate={false}>
                    <TextValidator label='Название' variant='outlined' type='text' name='name'
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setCardset({ ...cardset, name: e.target.value })}
                        value={cardset.name}
                        validators={DeckNameValidators}
                        errorMessages={DeckNameErrorMessages}
                    />
                    <TextValidator label='Описание' variant='outlined' type='text' name='description'
                        rows={4} rowsMax={4} multiline
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setCardset({ ...cardset, description: e.target.value })}
                        value={cardset.description}
                        validators={DeckDescriptionValidators}
                        errorMessages={DeckDescriptionErrorMessages}
                    />
                    <ImageDropzone onAddImage={handleAddImage} />
                    <ButtonLink className='buttonLink' type='submit'>
                        <a>Сохранить</a>
                    </ButtonLink>
                    <ButtonLink className='buttonLink'>
                        <Link to={pathRedirect}>Отмена</Link>
                    </ButtonLink>
                </ValidatorForm >
                <div className='part2'>
                    <DemoCardset />
                </div>
            </div >
    );
}