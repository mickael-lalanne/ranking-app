import { RankedElement } from './Element';
import { UserId } from './User';

export interface Tierlist {
    id: number;
    name: string;
    userId: UserId;
    templateId: number;
    rankedElements: RankedElement[];
    createdAt: string; // ex: "2023-11-16T20:26:59.654363Z"
}
