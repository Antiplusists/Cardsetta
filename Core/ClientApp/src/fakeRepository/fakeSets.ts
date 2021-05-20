import { CardsetInfo } from '../types/CardsetInfo'

const emptySet: CardsetInfo = {
    id: '',
    cardIds: [],
    name: ''
}

const sets: Map<string, CardsetInfo> = new Map([
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

export function getSetById(id: string) {
    const set = sets.get(id);
    return set ?? { ...emptySet, id: `${sets.keys.length}` };
}

export function changeCardsInSetById(id: string, cardIds: string[]) {
    const set = getSetById(id);
    set.cardIds = cardIds;
}

export function containsCardInSet(setId: string, cardId: string) {
    const set = sets.get(setId);
    return set ? set.cardIds.some(i => i === cardId) : false;
}

export function getAllCardsets() {
    return Array.from(sets.values());
}

export function updateCardset(cardset: CardsetInfo) {
    const set = getSetById(cardset.id);
    set.cardIds = cardset.cardIds;
    set.name = cardset.name;
    set.description = cardset.description;
    set.image = cardset.image;
}

