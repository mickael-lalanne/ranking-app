import { Tierlist } from '../models/Tierlist';

const TIERLIST_ENDPOINT: string = 'tierlist';

// GET ALL
export const getTierlists = async (): Promise<Tierlist[]> => {
    const tierlistsResponse = await fetch(TIERLIST_ENDPOINT);
    return await tierlistsResponse.json();
};

// POST
export const createTierlist = async (tierlistToCreate: Tierlist): Promise<Tierlist> => {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tierlistToCreate)
    };

    const serverResponse = await fetch(TIERLIST_ENDPOINT, requestOptions);
    return await serverResponse.json();
}

// DELETE
export const deleteTierlist = async (tierlistId: number): Promise<void> => {
    await fetch(`${TIERLIST_ENDPOINT}/${tierlistId}`, { method: 'DELETE' });
};

// PUT
export const updateTierlist = async (tierlistToUpdate: Tierlist): Promise<Response> => {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tierlistToUpdate)
    };

    return await fetch(`${TIERLIST_ENDPOINT}/${tierlistToUpdate.id}`, requestOptions);
}
