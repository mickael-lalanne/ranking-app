import { RankedElement } from './Element';

export interface Tierlist {
    id: string;
    name: string;
    userId?: string;
    templateId: string;
    rankedElements: RankedElement[];
    createdAt: string; // ex: "2023-11-16T20:26:59.654363Z"
}

export enum ETierlistDragItem {
    Element = 'element'
}
