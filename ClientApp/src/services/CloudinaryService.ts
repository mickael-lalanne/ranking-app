import { Element } from '../models/Element';
import axios, { AxiosResponse } from 'axios';

const CLOUDINARY_ENDPOINT: string = 'cloudinary';
const UPLOAD_ENDPOINT: string = `${CLOUDINARY_ENDPOINT}/uploadSignature`;
const DELETE_ENDPOINT: string = `${CLOUDINARY_ENDPOINT}/deleteSignature`;
const CLOUD_NAME: string = 'ranking-app';
export const CLOUDINARY_API_URL: string = 'https://api.cloudinary.com/v1_1';

interface SignatureResponse {
    apikey: string,
    timestamp: number,
    signature: string,
    cloudname: string,
}

interface UploadSignatureResponse extends SignatureResponse {
    folder: string
};

interface DeleteSignatureResponse extends SignatureResponse {
    publicId: string
};

type uploadPromiseResponse = {
    elementId: string,
    publicId: string
};

/**
 * @param {string} imagePath <folder>/<imageId>.<format>
 * @returns {string} cloudinary url to display the image
 */
export const getElementImageUrl = (imagePath: string): string => {
    return`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${imagePath}`;
};

/**
 * Called when a template needs to be created, before updating the database
 * Upload all images elements to Cloudinary and fill elements object with the returned public id
 * @param {Element[]} elements elements from the template to create, image field should be a File
 * @returns {Promise<Element[]>} elements array but the image field should be the public id string
 */
export const uploadElementsImages = async (
    elements: Element[]
): Promise<Element[]> => {
    // First, call the server to get signature data
    const signatureResponse: AxiosResponse<UploadSignatureResponse> =
        await axios.post(UPLOAD_ENDPOINT);
    
    const signData: UploadSignatureResponse = await signatureResponse.data;

    const url: string = `${CLOUDINARY_API_URL}/${signData.cloudname}/image/upload`;

    const uploadPromises: Promise<uploadPromiseResponse>[] = [];

    // Then, upload to Cloudinary the image of all elements
    elements.forEach(elt => {
        const uploadPromise = new Promise<uploadPromiseResponse>((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', elt.image);
            formData.append('api_key', signData.apikey);
            formData.append('timestamp', signData.timestamp.toString());
            formData.append('signature', signData.signature);
            formData.append('folder', signData.folder);
    
            axios.post(url, formData)
                .then(response => {
                    // For type, cf https://github.com/cloudinary/cloudinary_npm/blob/master/types/index.d.ts#L614
                    resolve({
                        elementId: elt.id!,
                        // Save the public id returned by the Cloudinary response
                        // it will be used to display the images
                        publicId: response.data.public_id
                    });
                })
                .catch(err => {
                    reject(err);
                });
        });
        uploadPromises.push(uploadPromise);
    });

    // Once all images have been uploaded
    const uploadResponses: uploadPromiseResponse[] = await Promise.all(uploadPromises);

    // Return the elements array to create, with the image field filled with the cloudinary public id
    return elements.map(elt => { return {
        ...elt,
        image: uploadResponses.find(response => response.elementId === elt.id)?.publicId!
    }});
};

/**
 * Called when a template needs to be deleted, before updating the database
 * Delete all images elements present in Cloudinary
 * @param {Element[]} elements elements from the template to delete, image field should be the cloudinary public id
 */
export const deleteElementsImages = async (elements: Element[]): Promise<void> => {
    // First, call the server to get signatures data
    // Unlike upload, we need a unique signature for each image to delete
    const allPublicIdsToSign: string[] = elements.map(elt => elt.image);

    const signatureResponse: AxiosResponse<DeleteSignatureResponse[]> =
        await axios.post(DELETE_ENDPOINT, allPublicIdsToSign);
    const allDeleteSignatures: DeleteSignatureResponse[] = await signatureResponse.data;

    const url: string = `${CLOUDINARY_API_URL}/${CLOUD_NAME}/image/destroy`;
    const deletePromises: Promise<void>[] = [];

    allDeleteSignatures.forEach(signature => {
        const deletePromise = new Promise<void>((resolve, reject) => {
            const formData = new FormData();
            formData.append('public_id', signature.publicId);
            formData.append('api_key', signature.apikey);
            formData.append('timestamp', signature.timestamp.toString());
            formData.append('signature', signature.signature);
    
            axios.post(url, formData)
                .then(() =>  resolve())
                .catch(err => {
                    reject(err);
                });
        });
        deletePromises.push(deletePromise);
    });

    // Once all images have been delete
    await Promise.all(deletePromises);

    return;
}
