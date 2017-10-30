export interface Card {
    id?: string;
    title: string;
    order: number;
}

export interface List {
    id?: string;
    title: string;
    order: number;
    cards: Card[];
}