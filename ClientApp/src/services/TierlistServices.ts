import { AppDispatch } from '../app/store';
import { Tierlist } from '../models/Tierlist';
import {
    addTierlist as addTierlistInStore,
    init,
    removeTierlist as removeTierlistInStore,
    updateTierlist as updateTierlistInStore
} from '../store/TierlistStore';

const TIERLIST_ENDPOINT: string = 'tierlist';

// GET ALL
export const getTierlists = async (dispatch: AppDispatch): Promise<void> => {
    const tierlistsResponse = await fetch(TIERLIST_ENDPOINT);
    const allUserTierlists: Tierlist[] = await tierlistsResponse.json();
    // Save user tierlists in the store
    dispatch(init(allUserTierlists));
};

// POST
export const createTierlist = async (
    tierlistToCreate: Tierlist,
    dispatch: AppDispatch
): Promise<Tierlist> => {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tierlistToCreate)
    };

    const serverResponse = await fetch(TIERLIST_ENDPOINT, requestOptions);
    const createdTierlist: Tierlist = await serverResponse.json();
    
    // Save the created template in the store
    dispatch(addTierlistInStore(createdTierlist));

    return createdTierlist;
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
