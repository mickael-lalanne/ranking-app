import { Element } from './Element';

export interface Template {
    id: number;
    name: string;
    userId: number;
    tiers: Tier[];
    elements: Element[];
    createdAt: string; // ex: "2023-11-16T20:26:59.654363Z"
}

export interface Tier {
    id: number;
    name: string;
    rank: number;
}