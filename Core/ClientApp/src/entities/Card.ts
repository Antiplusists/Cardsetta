export interface CardEntity {
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

export const CreateEmptyCard = (): CardEntity => {
    return {
        id: '',
        type: CardType.Text,
        question: '',
        answer: '',
    };
};