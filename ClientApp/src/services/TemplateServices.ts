import { Template } from "../models/Template";

const TEMPLATE_ENDPOINT: string = 'template';

// GET ALL
export const getTemplates = async (): Promise<Template[]> => {
    const templatesResponse = await fetch(TEMPLATE_ENDPOINT);
    return await templatesResponse.json();
};

// POST
export const createTemplate = async (templateToCreate: Template): Promise<Template> => {
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
