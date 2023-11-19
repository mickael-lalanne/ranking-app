import { Template } from "../models/Template";
import { isTemporaryId } from "./Util";

const TEMPLATE_ENDPOINT: string = 'template';

// GET ALL
export const getTemplates = async (): Promise<Template[]> => {
    const templatesResponse = await fetch(TEMPLATE_ENDPOINT);
    return await templatesResponse.json();
};

// POST
export const createTemplate = async (templateToCreate: Template): Promise<Template> => {
    _removeTmpIds(templateToCreate);

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateToCreate)
    };

    const serverResponse = await fetch(TEMPLATE_ENDPOINT, requestOptions);
    return await serverResponse.json();
}

// DELETE
export const deleteTemplate = async (templateId: number): Promise<void> => {
    await fetch(`${TEMPLATE_ENDPOINT}/${templateId}`, { method: 'DELETE' });
};

// PUT
export const updateTemplate = async (templateToUpdate: Template): Promise<Response> => {
    _removeTmpIds(templateToUpdate);

    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateToUpdate)
    };

    return await fetch(`${TEMPLATE_ENDPOINT}/${templateToUpdate.id}`, requestOptions);
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
