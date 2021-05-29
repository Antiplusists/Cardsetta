import DeckEntity from "./Deck";

export default interface DeckPageEntity  {
    currentPage: number,
    totalPages: number,
    pageSize: number,
    totalCount: number,
    hasPrevious: boolean,
    hasNext: boolean,
    items: DeckEntity[]
}