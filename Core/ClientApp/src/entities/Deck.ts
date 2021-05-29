export default interface DeckEntity {
    id: string,
    authorId: string,
    name: string,
    description: string,
    imagePath: string,
    tags: string[]
}

export const CreateEmptyDeck = (): DeckEntity => {
    return {
        id: '',
        authorId: '',
        name: '',
        description: '',
        imagePath: '',
        tags: []
    };
};