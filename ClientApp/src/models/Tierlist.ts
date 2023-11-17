import { RankedElement } from './Element';

export interface Tierlist {
    id: number;
    name: string;
    userId: number;
    templateId: number;
    rankedElements: RankedElement[];
    createdAt: string; // ex: "2023-11-16T20:26:59.654363Z"
}
