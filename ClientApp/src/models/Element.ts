export interface Element {
    id?: number;
    name: string;
    image: string;
    type?: number;
}

export interface RankedElement {
    elementId: number;
    tierId: number;
    position: number;
}
