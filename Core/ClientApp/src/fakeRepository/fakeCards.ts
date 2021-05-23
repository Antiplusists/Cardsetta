import { CardInfo } from '../types/CardInfo'

const emptyCard: CardInfo = {
    id: '',
    questionText: '',
    answearText: ''
}

const cards: Map<string, CardInfo> = new Map([
    ['0', {
        id: '0',
        questionImg: 'images/forTest/tree.png',
        questionText: 'Tree',
        answearText: 'Дерево'
    }],
    ['1', {
        id: '1',
        questionImg: 'images/forTest/tree_2.png',
        questionText: 'Real tree',
        answearText: 'Настоящее дерево'
    }],
    ['2', {
        id: '2',
        questionText: 'House',
        answearText: 'Жилой дом'
    }]
]);

export function getCardById(id: string | null) {
    if (id === null) {
        return { ...emptyCard, id: `${cards.size}` };
    }
    const card = cards.get(id);
    return card ?? { ...emptyCard, id: `${cards.size}` }
}

export function setCard(card: CardInfo) {
    cards.set(card.id, card);
}