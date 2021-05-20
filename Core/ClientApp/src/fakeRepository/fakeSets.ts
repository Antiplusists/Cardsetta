type SetInfo = {
    id: string,
    cardIds: string[]
}

const emptySet: SetInfo = {
    id: '',
    cardIds: []
}

const sets: Map<string, SetInfo> = new Map([
    ['0', {
        id: '0',
        cardIds: ['0', '1', '2']
    }],
    ['1', {
        id: '1',
        cardIds: ['2', '1', '0']
    }],
    ['2', {
        id: '2',
        cardIds: ['1', '2']
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

