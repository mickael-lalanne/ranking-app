export interface Element {
    id?: number;
    name: string;
    image: string | File;
    type?: number;
}

export interface RankedElement {
    elementId: number;
    tierId: number;
    position: number;
}
