import { AppDispatch } from '../app/store';
import { Template } from '../models/Template';
import {
    addTemplate as addTemplateInStore,
    init,
    removeTemplate as removeTemplateInStore,
    updateTemplate as updateTemplateInStore
} from '../store/TemplateStore';
import { deleteElementsImages } from './CloudinaryService';
import { isTemporaryId } from './Util';
import axios, { AxiosResponse } from 'axios';

const TEMPLATE_ENDPOINT: string = 'template';

// GET ALL
export const getTemplates = async (dispatch: AppDispatch, userId: string): Promise<void> => {
    const queryParams: string = `?userId=${userId}`;

    const templatesResponse: AxiosResponse<Template[]> = await axios.get(
        TEMPLATE_ENDPOINT + queryParams
    );

    const allUserTemplates: Template[] = await templatesResponse.data;
    // Save user templates in the store
    dispatch(init(allUserTemplates));
};

// POST
export const createTemplate = async (
    templateToCreate: Template,
    dispatch: AppDispatch
): Promise<Template> => {
    _removeTmpIds(templateToCreate);

    const serverResponse: AxiosResponse<Template> =
        await axios.post(TEMPLATE_ENDPOINT, templateToCreate);

    const createdTemplated: Template = await serverResponse.data;

    // Save the created template in the store
    dispatch(addTemplateInStore(createdTemplated));

    return createdTemplated;
}

// DELETE
export const deleteTemplate = async (
    templateToDelete: Template,
    dispatch: AppDispatch
): Promise<void> => {
    // First, delete all elements images on Cloudinary
    await deleteElementsImages(templateToDelete.elements);

    // Then, call the server to delete the template in base
    await axios.delete(`${TEMPLATE_ENDPOINT}/${templateToDelete.id}`);

    // Once template is deleted in base, remove it from the store
    dispatch(removeTemplateInStore(templateToDelete.id!));
};

// PUT
export const updateTemplate = async (
    templateToUpdate: Template,
    dispatch: AppDispatch
): Promise<void> => {
    _removeTmpIds(templateToUpdate);

    await axios.put(`${TEMPLATE_ENDPOINT}/${templateToUpdate.id}`,templateToUpdate);

    // Once template is updated in base, update the store
    dispatch(updateTemplateInStore(templateToUpdate)); 
}

/**
 * Remove all tmp ids for the tiers and elements contained in the template
 * @param {Template} template the template where tmp ids needs to be removed
 */
const _removeTmpIds = (template: Template) => {
    // We can't set the id directly because the template object came from the store and is readonly
    // So use map(), otherwise we got the "Cannot assign to read only property 'id' of object" TypeError

    template.tiers = template.tiers.map((tier) => {
        return { ...tier, id: isTemporaryId(tier.id!) ? undefined : tier.id };
    });

    template.elements = template.elements.map((element) => {
        return { ...element, id: isTemporaryId(element.id!) ? undefined : element.id };
    });
};
