import './DeckSettings.css';
import { ChangeEvent, useRef, useState } from 'react';
import { Button } from '@material-ui/core'
import { FileObject } from 'material-ui-dropzone'
import { Link } from 'react-router-dom';
import { ButtonLink } from '../CustomButtons/ButtonLink'
import DeckEntity from '../../entities/Deck';
import ImageDropzone from '../ImageDropzone/ImageDropzone';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { DeckNameValidators, DeckDescriptionValidators } from '../../validators/Validators';
import { DeckNameErrorMessages, DeckDescriptionErrorMessages } from '../../validators/ErrorMessage';
import ChipInput from 'material-ui-chip-input'
import { LoadingButton } from '../CustomButtons/LoadingButton';

type DeckSettingsProps = {
    deck: DeckEntity,
    pathRedirect: string,
    onSave?: (deck: DeckEntity, file?: File) => Promise<void>,
}

export default function DeckSettings(props: DeckSettingsProps) {
    const { deck, onSave, pathRedirect } = props;
    const [deckState, setDeckState] = useState<DeckEntity>(deck);
    const file = useRef<File>();

    const [isLoading, setIsLoding] = useState(false);

    const [tagsInputValue, setTagsInputValue] = useState('');
    const filterTag = (tag: string) => tag.replace(/[^\d^a-zа-я]/g, '').slice(0, 10);

    async function handleSave() {
        if (onSave) {
            setIsLoding(true);
            await onSave(deckState, file.current);
            setIsLoding(false);
        }
    }

    function handleAddImage(files: FileObject[]) {
        setDeckState({ ...deckState, imagePath: files[0].data?.toString() ?? '' });
        file.current = files[0].file;
    }

    function handleDeleteImage() {
        if (deckState.imagePath) {
            setDeckState({ ...deckState, imagePath: '' });
            file.current = undefined;
        }
    }

    const DeckDemo = () => {
        return (<div className='deckPreviewBlock '>
            <div className='deckPreview flexCenter'>
                {deckState.imagePath
                    ?
                    <img src={deckState.imagePath} alt='preview' />
                    :
                    <div className='textBlock'>
                        <h1 className='name'>{deckState.name}</h1>
                        <p>{deckState.description}</p>
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
            <ValidatorForm className='part1' onSubmit={handleSave} instantValidate={false}>
                <TextValidator label='Название' variant='outlined' type='text' name='name'
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDeckState({ ...deckState, name: e.target.value })}
                    value={deckState.name}
                    validators={DeckNameValidators}
                    errorMessages={DeckNameErrorMessages}
                />
                <TextValidator label='Описание' variant='outlined' type='text' name='description'
                    rows={4} rowsMax={4} multiline
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDeckState({ ...deckState, description: e.target.value })}
                    value={deckState.description ?? ''}
                    validators={DeckDescriptionValidators}
                    errorMessages={DeckDescriptionErrorMessages}
                />
                <ChipInput className='chipInput' variant='outlined' label='Теги для поиска'
                    newChipKeys={[' ', 'Enter']} defaultValue={deckState.tags}
                    InputProps={{
                        value: tagsInputValue,
                        onChange: (e => setTagsInputValue(filterTag(e.target.value)))
                    }}
                    onBeforeAdd={() => { setTagsInputValue(''); return true; }}
                    onChange={(tags) => setDeckState({ ...deckState, tags: tags })}
                />
                <ImageDropzone className='miniDropzone' onAddImage={handleAddImage} />
                <LoadingButton className='loadingButton' loading={isLoading}
                    text='Сохранить' type='submit' />
                <ButtonLink className='buttonLink'>
                    <Link to={pathRedirect}>Назад</Link>
                </ButtonLink>
            </ValidatorForm >
            <div className='part2'>
                <DeckDemo />
            </div>
        </div >
    );
}