import { AppDispatch } from '../app/store';
import { Tierlist } from '../models/Tierlist';
import {
    addTierlist as addTierlistInStore,
    init,
    removeTierlist as removeTierlistInStore,
    updateTierlist as updateTierlistInStore
} from '../store/TierlistStore';
import axios, { AxiosResponse } from 'axios';

const TIERLIST_ENDPOINT: string = 'tierlist';

// GET ALL
export const getTierlists = async (dispatch: AppDispatch): Promise<void> => {
    const tierlistsResponse: AxiosResponse<Tierlist[]> = await axios.get(TIERLIST_ENDPOINT);

    const allUserTierlists: Tierlist[] = await tierlistsResponse.data;
    // Save user tierlists in the store
    dispatch(init(allUserTierlists));
};

// POST
export const createTierlist = async (
    tierlistToCreate: Tierlist,
    dispatch: AppDispatch
): Promise<Tierlist> => {
    const serverResponse: AxiosResponse<Tierlist> = await axios.post(TIERLIST_ENDPOINT, tierlistToCreate);
    const createdTierlist: Tierlist = await serverResponse.data;
    
    // Save the created tierlist in the store
    dispatch(addTierlistInStore(createdTierlist));

    return createdTierlist;
}

// DELETE
export const deleteTierlist = async (
    tierlistToDelete: Tierlist,
    dispatch: AppDispatch
): Promise<void> => {
    await axios.delete(`${TIERLIST_ENDPOINT}/${tierlistToDelete.id}`);
    // Once tierlist is deleted in base, remove it from the store
    dispatch(removeTierlistInStore(tierlistToDelete.id));
};

// PUT
export const updateTierlist = async (
    tierlistToUpdate: Tierlist,
    dispatch: AppDispatch
): Promise<void> => {
    await axios.put(`${TIERLIST_ENDPOINT}/${tierlistToUpdate.id}`, tierlistToUpdate);

    // Once tierlist is updated in base, update the store
    dispatch(updateTierlistInStore(tierlistToUpdate)); 
}
