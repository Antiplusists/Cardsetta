export interface Card {
    id: string,
    type: CardType,
    question: string,
    answer: string,
    imagePath?: string
}

export enum CardType {
    Text,
    Photo,
    Mixed
}