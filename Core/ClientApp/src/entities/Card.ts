export interface CardEntity {
    id: string,
    question: string,
    answer: string,
    imagePath?: string,
    timeToRepeat: Record<string, Date>
}

export const CreateEmptyCard = (): CardEntity => {
    return {
        id: '',
        question: '',
        answer: '',
        timeToRepeat: {},
    };
};