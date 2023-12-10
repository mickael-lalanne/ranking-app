export interface Element {
    id?: string;
    name: string;
    image: string;
    type?: number;
}

export interface RankedElement {
    elementId: string;
    tierId: string;
    position: number;
}
