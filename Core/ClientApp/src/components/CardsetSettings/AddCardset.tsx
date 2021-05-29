import CardsetSettings from './CardsetSettings'
import Deck, { CreateEmptyDeck } from '../../entities/Deck';
import authService from '../api-authorization/AuthorizeService';
import { ApiPaths } from '../api-authorization/ApiAuthorizationConstants';

export default function AddCardset() {
    const onSave = async (cardset: Deck, file?: File) => {
        const formData = new FormData();
        formData.append('name', cardset.name);
        formData.append('description', cardset.description);
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
        const deck = await response.json() as Deck;
        const user = authService.getUser();
        if (user !== null) {
            authService.updateState({ ...user, deckIds: [...user.deckIds, deck.id] });
        }
    }
    return (
        <CardsetSettings deck={CreateEmptyDeck()} onSave={onSave} pathRedirect='/custom-cardsets' />
    );
}