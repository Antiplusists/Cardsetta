export default interface Deck {
    id: string,
    authorId: string,
    name: string,
    description: string,
    imagePath: string,
    tags: string[]
}

export const CreateEmptyDeck = (): Deck => {
    return {
        id: '',
        authorId: '',
        name: '',
        description: '',
        imagePath: '',
        tags: []
    };
};