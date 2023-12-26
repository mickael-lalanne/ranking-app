import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { css } from '@emotion/css';
import { Element } from '../../models/Element';
import { ResizedImage, generateRandomId, resizeImage } from '../../services/Util';
import { EEditViewMode } from '../../models/Template';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ElementPreview from '../shared/ElementPreview';
import AddElementButton from '../shared/AddElementButton';
import { ELEMENT_SIZE } from '../../utils/css-utils';
import { useAppSelector } from '../../app/hooks';

/**
 * View displayed when the user wants to create a new element or edit an existing one
 */
const ElementEditView = ({createCallback, cancelCallback, editViewMode, defaultImages}: {
    createCallback: (elements: Element[]) => void,
    cancelCallback: () => void,
    editViewMode: EEditViewMode,
    defaultImages: ResizedImage[]
}) => {
    const [currentElements, setCurrentElements] = useState<Element[]>([]);
    const [uploadBtnHover, setUploadBtnHover] = useState<string>();

    /**
     * Called when the defaultImages props has changed
     * Set the current elements with thanks to default images data
     */
    useEffect(() => {
        const elements: Element[] = _convertImagesToElements(defaultImages);
        setCurrentElements(elements);
    }, [defaultImages]);

    const loading: boolean = useAppSelector(state => state.application.loading);

    // Called when the "Create" button of the edit view has been clicked
    const createElements = () => {
        createCallback(currentElements);
    };

    // Called when the element name has changed
    const onNameFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, elementId: string) => {
        const eltToUpdateIndex: number = currentElements.findIndex(e => e.id === elementId);
        if (eltToUpdateIndex > -1) {
            currentElements[eltToUpdateIndex].name = e.target.value;
            setCurrentElements([...currentElements]);
        }
    };

    // Called when the user has chosen an image with the file input
    const onImageFieldChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        elementId: string
    ): Promise<void> => {
        const eltToUpdateIndex: number = currentElements.findIndex(e => e.id === elementId);
        if (eltToUpdateIndex > -1) {
            if (e.target.files) {
                const resizedImage = await resizeImage(e.target.files[0]);
                // Be sure to create a new object so ElementPreview can detect the change
                // Otherwise the useEffect for the element props is not called
                // So we need to create a new reference (for objects AND arrays)
                currentElements[eltToUpdateIndex] = {
                    ...currentElements[eltToUpdateIndex],
                    image: resizedImage.source
                };
                setCurrentElements([...currentElements]);
            }
        }
        setUploadBtnHover(undefined);
    };

    // Called when the cancel button has been clicked
    const onCancelButtonClick = (): void => {
        // Reset data
        setCurrentElements([]);

        cancelCallback();
    };

    // Called when the user has selected one or many images for its elements
    const onElementImageInputChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        if (e.target.files) {
            const resizeFilePromises: Promise<ResizedImage>[] = [];

            // Resize all images selectionned by the user
            Array.from(e.target.files).forEach(file => {
                resizeFilePromises.push(resizeImage(file));
            });

            // Once all images have been resized
            const resizedImages: ResizedImage[] = await Promise.all(resizeFilePromises);

            const newElements = _convertImagesToElements(resizedImages);
            setCurrentElements(currentElements.concat(newElements));
        }
    };

    // The content of the upload button
    // It can be the element's image if it exists, and the upload icon if hovered
    const UploadButtonContent = (elt: Element): React.JSX.Element => {
        const uploadIcon: React.JSX.Element = <UploadFileIcon className={upload_icon_style} />;

        return (<>
            <ElementPreview element={elt} readonly />
            {/* Show the upload icon only on hover */}
            { uploadBtnHover === elt.id ? uploadIcon : null }
        </>);
    };

    const ElementsEdition = (): React.JSX.Element[] => {
        const editionsView: React.JSX.Element[] = [];
        currentElements.forEach(elt => {
            const eltEditView = <div className={element_edit_view_content_style} key={elt.id}>
                <div className={element_image_style}>
                    <Button
                        variant="contained"
                        component="label"
                        className={upload_btn_style}
                        onMouseEnter={() => setUploadBtnHover(elt.id)}
                        onMouseLeave={() => setUploadBtnHover('')}
                    >
                        {UploadButtonContent(elt)}
                        <input
                            type="file"
                            className={image_input_style}
                            onChange={e => onImageFieldChange(e, elt.id!)}
                        ></input>
                    </Button>
                </div>
                <TextField
                    label="Element name"
                    variant="outlined"
                    style={{ flex: 1 }}
                    value={elt.name}
                    onChange={e => onNameFieldChange(e, elt.id!)}
                />
            </div>;

            editionsView.push(eltEditView);
        });

        return editionsView;
    };

    if (editViewMode === EEditViewMode.EditElement && !loading) {
        return (<div className={element_edit_view_container_style}>
            <Alert severity="info" className={warning_message_style}>
                FYI : all your images are automatically resized to have a maximum size of 150x150.
            </Alert>

            {ElementsEdition()}

            <div className={footer_style}>
                <AddElementButton changeCallback={onElementImageInputChange} />
                <div className="app_spacer"></div>
                <Button
                    variant="outlined"
                    onClick={onCancelButtonClick}
                    className={footer_btn_style}
                >
                        Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={createElements}
                    className={footer_btn_style}
                    style={{ marginLeft: '10px' }}
                    data-cy="create-element-button"
                >
                    Create
                </Button>
            </div>
        </div>);
    }
    return <></>;
};


/**
 * Convert images files into elements
 * @param {string[]} imagesFile the images (as DataURI) to convert
 * @returns {Element[]} element array with a random id and the image's name as name
 */
const _convertImagesToElements = (images: ResizedImage[]): Element[] => {
    const elements: Element[] = images.map(img => {
        return {
            id: generateRandomId(),
            image: img.source,
            name: img.name
        };
    });

    return elements;
}


export default ElementEditView;

/**
 * CSS STYLES
 */
const element_edit_view_container_style = css({
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px;',
    marginTop: '15px',
    padding: '30px'
});

const element_edit_view_content_style = css({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px'
});

const footer_style = css({
    display: 'flex'
});

const footer_btn_style = css({
    marginTop: '10px !important',
    marginBottom: '10px !important'
});

const element_image_style = css({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px',
    width: ELEMENT_SIZE,
    height: ELEMENT_SIZE
});

const upload_btn_style = css({
    padding: '0px !important',
    height: '100%',
    minWidth: 'unset !important',
    width: '100%'
});

const upload_icon_style = css({
    position: 'absolute',
    width: '100% !important',
    height: '100% !important',
    top: 0,
    left: 0,
    padding: '7.5px',
    color: 'white'
});

const image_input_style = css({
    opacity: 0,
    zIndex: -9999,
});

const warning_message_style = css({
    marginBottom: '25px'    
});
