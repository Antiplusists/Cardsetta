import useQuery from '../../customHooks/useQuery';
import { CardEntity, CreateEmptyCard } from "../../entities/Card";
import { ApiPaths } from "../api-authorization/ApiAuthorizationConstants";
import authService from "../api-authorization/AuthorizeService";
import CardSettings from './CardSettings';

export default function AddCard() {
    const query = useQuery();
    const deckId = query.get('deck');

    async function onSave(card: CardEntity, file?: File) {

        const formData = new FormData();
        formData.append('question', card.question);
        formData.append('answer', card.answer);
        if (file)
            formData.append('image', file, file.name);
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

    return (
        <CardSettings card={CreateEmptyCard()} deckId={deckId!} onSave={onSave} />
    );
}