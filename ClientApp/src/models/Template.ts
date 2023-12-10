import { Element } from './Element';
import { UserId } from './User';

export interface Template {
    id?: string;
    name: string;
    userId?: UserId;
    tiers: Tier[];
    elements: Element[];
    createdAt?: string; // ex: "2023-11-16T20:26:59.654363Z"
}

export interface Tier {
    id?: string;
    name: string;
    rank: number;
}

export const TIERS_COLORS: string[] = [
    '#FF8C7F', // Rank 1
    '#FFC07D', // Rank 2
    '#FEF782', // Rank 3
    '#7AEA81', // Rank 4
    '#78BDFD', // Rank 5
];

export enum ETemplateMode {
    Viewer = 'viewer',
    Builder = 'builder',
    Editor = 'editor'
};

export enum EEditViewMode {
    EditElement = 'edit-element', // When user wants to edit an element
    EditTier = 'edit-tier', // When user wants to edit a tier
    Hide = 'hide' // When the view isn't displayed or an element
};
