import { AppDispatch } from "../app/store";
import { Template } from "../models/Template";
import {
    addTemplate as addTemplateInStore,
    init,
    removeTemplate as removeTemplateInStore,
    updateTemplate as updateTemplateInStore
} from "../store/TemplateStore";
import { isTemporaryId } from "./Util";

const TEMPLATE_ENDPOINT: string = 'template';

// GET ALL
export const getTemplates = async (dispatch: AppDispatch): Promise<void> => {
    const templatesResponse: Response = await fetch(TEMPLATE_ENDPOINT);
    const allUserTemplates: Template[] = await templatesResponse.json();
    // Save user templates in the store
    dispatch(init(allUserTemplates));
};

// POST
export const createTemplate = async (
    templateToCreate: Template,
    dispatch: AppDispatch
): Promise<Template> => {
    _removeTmpIds(templateToCreate);

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateToCreate)
    };

    const serverResponse: Response = await fetch(TEMPLATE_ENDPOINT, requestOptions);
    const createdTemplated: Template = await serverResponse.json();
    // Save the created template in the store
    dispatch(addTemplateInStore(createdTemplated));

    return createdTemplated;
}

// DELETE
export const deleteTemplate = async (
    templateId: number,
    dispatch: AppDispatch
): Promise<void> => {
    await fetch(`${TEMPLATE_ENDPOINT}/${templateId}`, { method: 'DELETE' });
    // Once template is deleted in base, remove it from the store
    dispatch(removeTemplateInStore(templateId));
};

// PUT
export const updateTemplate = async (
    templateToUpdate: Template,
    dispatch: AppDispatch
): Promise<void> => {
    _removeTmpIds(templateToUpdate);

    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateToUpdate)
    };

    await fetch(`${TEMPLATE_ENDPOINT}/${templateToUpdate.id}`, requestOptions);
    // Once template is updated in base, update the store
    dispatch(updateTemplateInStore(templateToUpdate)); 
}

/**
 * Remove all tmp ids for the tiers and elements contained in the template
 * @param {Template} template the template where tmp ids needs to be removed
 */
const _removeTmpIds = (template: Template) => {
    template.tiers.forEach(tier => {
        tier.id = isTemporaryId(tier.id!) ? undefined : tier.id;
    });
    template.elements.forEach(element => {
        element.id = isTemporaryId(element.id!) ? undefined : element.id;
    });
};
