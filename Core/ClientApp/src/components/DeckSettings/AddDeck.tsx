import DeckSettings from './DeckSettings'
import DeckEntity, { CreateEmptyDeck } from '../../entities/Deck';
import authService from '../api-authorization/AuthorizeService';
import { ApiPaths } from '../api-authorization/ApiAuthorizationConstants';

export default function AddDeck() {
    const onSave = async (deck: DeckEntity, file?: File) => {
        const formData = new FormData();
        formData.append('name', deck.name);
        formData.append('description', deck.description);
        deck.tags.forEach(tag => formData.append('tags[]', tag));
        if (file)
            formData.append('image', file, file.name);
        const data = {
            method: 'POST',
            body: formData
        }
        authService.addAuthorizationHeader(data);
        const response = await fetch(ApiPaths.decks.default, data);
        switch (response.status) {
            case 201: break;
            case 401: throw new Error(response.statusText);
            case 422: throw new Error(`Invalid data`);
            default: throw new Error(`Can not fetch ${ApiPaths.cards.default}`);
        }
        const newDeck = await response.json() as DeckEntity;
        const user = authService.getUser();
        if (user !== null) {
            authService.updateState({ ...user, deckIds: [...user.deckIds, newDeck.id] });
        }
    }
    return (
        <DeckSettings deck={CreateEmptyDeck()} onSave={onSave} pathRedirect='/custom-decks' />
    );
}