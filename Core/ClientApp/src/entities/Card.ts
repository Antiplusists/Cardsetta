export interface CardEntity {
    id: string,
    question: string,
    answer: string,
    imagePath?: string
}

export const CreateEmptyCard = (): CardEntity => {
    return {
        id: '',
        question: '',
        answer: '',
    };
};