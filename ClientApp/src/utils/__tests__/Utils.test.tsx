import {
    generateRandomId,
    getTooltipTitleForSaveButtons,
    isTemporaryId,
    sortByCreationDate,
} from '../Util';

describe('Utils', () => {
    it('generates a random guid', () => {
        const randomId1: string = generateRandomId();
        const randomId2: string = generateRandomId();

        const areIdsDifferent: boolean = randomId1 !== randomId2;
        expect(typeof randomId1).toBe('string');
        expect(areIdsDifferent).toBe(true);
    });

    it('checks if temporary id', () => {
        expect(isTemporaryId(generateRandomId())).toBe(true);
        expect(isTemporaryId('e97db211-4c97-4b0b-aa29-2d97c48300ca')).toBe(
            false
        );
    });

    it('sorts by creation date', () => {
        const unsortedItems: Partial<{ createdAt: string }>[] = [
            { createdAt: '2023-12-31T12:50:07.1409295Z' },
            { createdAt: '2029-12-31T12:50:07.1409295Z' },
            { createdAt: '2016-12-31T12:50:07.1409295Z' },
            { createdAt: '1899-12-31T12:50:07.1409295Z' },
        ];
        const sortedItems: Partial<{ createdAt: string }>[] = [
            { createdAt: '1899-12-31T12:50:07.1409295Z' },
            { createdAt: '2016-12-31T12:50:07.1409295Z' },
            { createdAt: '2023-12-31T12:50:07.1409295Z' },
            { createdAt: '2029-12-31T12:50:07.1409295Z' },
        ];
        expect(sortByCreationDate(unsortedItems)).toEqual(sortedItems);
    });

    it('gets tooltip title for save buttons', () => {
        expect(getTooltipTitleForSaveButtons()).toBeUndefined();
        expect(getTooltipTitleForSaveButtons('content')).toEqual(
            <span style={{ fontSize: '15px' }}>content</span>
        );
    });
});
