// All items that are not yet saved in the database starts with the following identifier
const TMP_ID_IDENTIFIER = '99999';

/**
 * Generate a temporary for items that are not yet saved in database
 * @returns {string} a random temporary id
 */
export const generateRandomId = (): string => {
    const randomNumber: number = Math.floor(Math.random() * 1000000000);
    return TMP_ID_IDENTIFIER + randomNumber;
};

/**
 * Check if an id is temporary
 * @param {string} id the id to check
 * @returns {boolean} true if the id is temporary
 */
export const isTemporaryId = (id: string): boolean => {
    return id.startsWith(TMP_ID_IDENTIFIER);
}

export interface ResizedImage {
    source: string; // the data URL of the image
    name: string;
}

/**
 * Resize an image while keeping its ratio
 * This function is called in the "onChange" event of input file
 * So we use the FileReader api to get the base image dimensions
 * @param {File} imageFile the image file to resize
 * @returns {Promise<ResizedImage>} an object containing the resized image as data URL and its name
 */
export const resizeImage = (imageFile: File): Promise<ResizedImage> => {
    const MAX_SIZE: number = 150;
    const reader = new FileReader();

    return new Promise ((resolve) => {
        reader.onload = () => {
            const tmpImg: HTMLImageElement = new Image();
    
            tmpImg.onload = () => {
                const resizeRatio = Math.min(MAX_SIZE / tmpImg.width, MAX_SIZE / tmpImg.height);

                // Initialize the canvas
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext('2d');
    
                // Set width and height
                canvas.width = tmpImg.width * resizeRatio;
                canvas.height = tmpImg.height * resizeRatio;
    
                // Draw image and export to a data-uri
                ctx!.drawImage(tmpImg, 0, 0, canvas.width, canvas.height);
    
                const dataURI = canvas.toDataURL();
                resolve({ source: dataURI, name: imageFile.name });
            };

            tmpImg.src = URL.createObjectURL(imageFile);
        }
        reader.readAsDataURL(imageFile);
    });

};
