import useQuery from '../../customHooks/useQuery';
import { Card, CardType, CreateEmptyCard } from "../../entities/Card";
import { ApiPaths } from "../api-authorization/ApiAuthorizationConstants";
import authService from "../api-authorization/AuthorizeService";
import QACardSettings from './QACardSettings';

export default function AddQACard() {
    const query = useQuery();
    const deckId = query.get('cardset');

    async function onSave(card: Card, file?: File) {

        const formData = new FormData();
        formData.append('question', card.question);
        formData.append('answer', card.answer);
        formData.append('type', CardType[card.type]);
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
        <QACardSettings card={CreateEmptyCard()} deckId={deckId!} onSave={onSave} />
    );
}