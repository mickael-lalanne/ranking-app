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
    
    // Save the created tierlist in the store
    dispatch(addTierlistInStore(createdTierlist));

    return createdTierlist;
}

// DELETE
export const deleteTierlist = async (
    tierlistId: string,
    dispatch: AppDispatch
): Promise<void> => {
    await fetch(`${TIERLIST_ENDPOINT}/${tierlistId}`, { method: 'DELETE' });
    // Once tierlist is deleted in base, remove it from the store
    dispatch(removeTierlistInStore(tierlistId));
};

// PUT
export const updateTierlist = async (
    tierlistToUpdate: Tierlist,
    dispatch: AppDispatch
): Promise<void> => {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tierlistToUpdate)
    };

    await fetch(`${TIERLIST_ENDPOINT}/${tierlistToUpdate.id}`, requestOptions);

    // Once tierlist is updated in base, update the store
    dispatch(updateTierlistInStore(tierlistToUpdate)); 
}
