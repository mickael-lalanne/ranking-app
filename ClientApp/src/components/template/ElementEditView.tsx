import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { css } from '@emotion/css';
import { Element } from '../../models/Element';
import { generateRandomId } from '../../services/Util';
import { EEditViewMode } from '../../models/Template';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ElementPreview from '../shared/ElementPreview';
import AddElementButton from '../shared/AddElementButton';

/**
 * View displayed when the user wants to create a new element or edit an existing one
 */
const ElementEditView = ({createCallback, cancelCallback, editViewMode, defaultImages}: {
    createCallback: (elements: Element[]) => void,
    cancelCallback: () => void,
    editViewMode: EEditViewMode,
    defaultImages: File[]
}) => {
    const [currentElements, setCurrentElements] = useState<Element[]>([]);
    const [uploadBtnHover, setUploadBtnHover] = useState<number>();

    /**
     * Called when the defaultImages props has changed
     * Set the current elements with thanks to default images data
     */
    useEffect(() => {
        const elements: Element[] = _convertFilesToElements(defaultImages);
        setCurrentElements(elements);
    }, [defaultImages]);

    // Called when the "Create" button of the edit view has been clicked
    const createElements = () => {
        createCallback(currentElements);
    };

    // Called when the element name has changed
    const onNameFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, elementId: number) => {
        const eltToUpdateIndex: number = currentElements.findIndex(e => e.id === elementId);
        if (eltToUpdateIndex > -1) {
            currentElements[eltToUpdateIndex].name = e.target.value;
            setCurrentElements([...currentElements]);
        }
    };

    // Called when the user has chosen an image with the file input
    const onImageFieldChange = (e: React.ChangeEvent<HTMLInputElement>, elementId: number): void => {
        const eltToUpdateIndex: number = currentElements.findIndex(e => e.id === elementId);
        if (eltToUpdateIndex > -1) {
            if (e.target.files) {
                // Be sure to create a new object so ElementPreview can detect the change
                // Otherwise the useEffect for the element props is not called
                // So we need to create a new reference (for objects AND arrays)
                currentElements[eltToUpdateIndex] = {
                    ...currentElements[eltToUpdateIndex],
                    image: e.target.files[0]
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
    const onElementImageInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            const newElements = _convertFilesToElements(Array.from(e.target.files));
            setCurrentElements(currentElements.concat(newElements));
        }
    };

    // The content of the upload button
    // It can be the element's image if it exists, and the upload icon if hovered
    const UploadButtonContent = (elt: Element): React.JSX.Element => {
        const uploadIcon: React.JSX.Element = <UploadFileIcon className={upload_icon_style} />;

        return (<>
            <ElementPreview element={elt} readonly padding="0" />
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
                        onMouseLeave={() => setUploadBtnHover(-1)}
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

    if (editViewMode === EEditViewMode.EditElement) {
        return (<div className={element_edit_view_container_style}>

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
 * @param {File} imagesFile the files to convert
 * @returns {Element[]} element array with a random id and the image's name as name
 */
const _convertFilesToElements = (imagesFile: File[]): Element[] => {
    const elements: Element[] = imagesFile.map(imgFile => {
        return {
            id: generateRandomId(),
            image: imgFile,
            name: imgFile.name
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
    width: '60px',
    height: '60px'
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
