import { Element } from '../models/Element';

const CLOUDINARY_ENDPOINT: string = 'cloudinary';

interface SignatureResponse {
    apikey: string,
    timestamp: number,
    signature: string,
    cloudname: string
};

type uploadPromiseResponse = {
    elementId: number,
    publicId: string
};

/**
 * Called when a template needs to be created, before updating the database
 * Upload all images elements to Cloudinary and fill elements object with the returned public id
 * @param {Element[]} elements elements from the template to create, image field should be a File
 * @returns {Promise<Element[]>} elements array but the image field should be the public id string
 */
export const uploadElementsImages = async (
    elements: Element[],
): Promise<Element[]> => {
    // First, call the server to get signature data
    const signatureResponse: Response = await fetch(CLOUDINARY_ENDPOINT);
    const signData: SignatureResponse = await signatureResponse.json();

    const url: string = `https://api.cloudinary.com/v1_1/${signData.cloudname}/auto/upload`;

    const uploadPromises: Promise<uploadPromiseResponse>[] = [];

    // Then, upload to Cloudinary the image of all elements
    elements.forEach(elt => {
        const uploadPromise = new Promise<uploadPromiseResponse>((resole, reject) => {
            const formData = new FormData();
            formData.append('file', elt.image);
            formData.append('api_key', signData.apikey);
            formData.append('timestamp', signData.timestamp.toString());
            formData.append('signature', signData.signature);
    
            fetch(url, { method: 'POST', body: formData })
                .then((response) => {
                    console.log(response);
                    // For type, cf https://github.com/cloudinary/cloudinary_npm/blob/master/types/index.d.ts#L614
                    response.json().then(uploadApiResponse => {
                        resole({
                            elementId: elt.id!,
                            // Save the public id return by the Cloudinary response
                            // it will be used to display the images
                            publicId: uploadApiResponse.public_id
                        });
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
