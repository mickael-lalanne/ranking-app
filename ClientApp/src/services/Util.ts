// All items that are not yet saved in the database starts with the following identifier
const TMP_ID_IDENTIFIER = '99999';

/**
 * Generate a temporary for items that are not yet saved in database
 * @returns {number} a random temporary id
 */
export const generateRandomId = (): number => {
    const randomNumber: number = Math.floor(Math.random() * 1000000000);
    return Number(TMP_ID_IDENTIFIER + randomNumber);
};

/**
 * Check if an id is temporary
 * @param {number} id the id to check
 * @returns {boolean} true if the id is temporary
 */
export const isTemporaryId = (id: number): boolean => {
    return String(id).startsWith(TMP_ID_IDENTIFIER);
}
