import { CardsetInfo } from '../types/CardsetInfo'

const emptyCardset: CardsetInfo = {
    id: '',
    cardIds: [],
    name: ''
}

const cardsets: Map<string, CardsetInfo> = new Map([
    ['0', {
        id: '0',
        cardIds: ['0', '1', '2'],
        name: 'Набор 0',
        image: 'images/forTest/tree.png',
    }],
    ['1', {
        id: '1',
        cardIds: ['2', '1', '0'],
        name: 'Набор 1',
        description: 'Описание набор 1',
        image: 'images/forTest/tree_2.png',
    }],
    ['2', {
        id: '2',
        cardIds: ['1', '2'],
        name: 'Набор 2',
    }]
]);

export function getCardsetById(id: string) {
    const cardset = cardsets.get(id);
    return cardset ?? { ...emptyCardset, id: `${cardsets.keys.length}` };
}

export function changeIdsInCardset(id: string, cardIds: string[]) {
    const cardset = getCardsetById(id);
    cardset.cardIds = cardIds;
}

export function containsCardInCardset(cardsetId: string, cardId: string) {
    const cardset = cardsets.get(cardsetId);
    return cardset ? cardset.cardIds.some(i => i === cardId) : false;
}

export function getAllCardsets() {
    return Array.from(cardsets.values());
}

export function updateCardset(cardset: CardsetInfo) {
    const oldCardset = getCardsetById(cardset.id);
    oldCardset.cardIds = cardset.cardIds;
    oldCardset.name = cardset.name;
    oldCardset.description = cardset.description;
    oldCardset.image = cardset.image;
}

