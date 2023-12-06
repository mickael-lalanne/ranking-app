import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { css } from '@emotion/css';
import { Element } from '../../models/Element';
import { generateRandomId } from '../../services/Util';
import { EEditViewMode } from '../../models/Template';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ElementPreview from '../shared/ElementPreview';

/**
 * View displayed when the user wants to create a new element or edit an existing one
 */
const ElementEditView = ({createCallback, cancelCallback, editViewMode}: {
    createCallback: (element: Element) => void,
    cancelCallback: () => void,
    editViewMode: EEditViewMode
}) => {
    const [elementName, setElementName] = useState<string>();
    const [elementImg, setElementImg] = useState<File>();
    const [uploadBtnHover, setUploadBtnHover] = useState<boolean>(false);
    const [shrink, setShrink] = useState(false);

    // Called when the "Create" button of the edit view has been clicked
    const createElement = () => {
        createCallback({
            id: generateRandomId(),
            name: elementName as string,
            image: elementImg!
        });
    };

    // Called when the element name has changed
    const onNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setElementName(e.target.value);
    };

    // Called when the user has chosen an image with the file input
    const onImageFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setElementImg(e.target.files[0]);
            // If the element name is not setted yet
            if (!elementName) {
                // Fill it with the file name
                setElementName(e.target.files[0].name);
                setShrink(true); // Change the label position (so it's not overlapped with the name)
            }
        } else {
            setElementImg(undefined);
        }
        setUploadBtnHover(false);
    };

    // Called when the cancel button has been clicked
    const onCancelButtonClick = (): void => {
        // Reset data
        setElementImg(undefined);
        setElementName(undefined);

        cancelCallback();
    };


    // The content of the upload button
    // It can be the element's image if it exists, or only the upload icon
    const UploadButtonContent = (): React.JSX.Element => {
        const uploadIcon: React.JSX.Element = <UploadFileIcon className={upload_icon_style} />;

        // If an image has already been choosen by the user, display it
        if (elementImg) {
            const tmpElement: Element = { name: elementName!, image: elementImg };

            return (<>
                <ElementPreview element={tmpElement} readonly padding="0" />
                {/* Show the upload icon only on hover */}
                { uploadBtnHover ? uploadIcon : null }
            </>);
        }
        // Otherwise, display only the upload icon
        return (uploadIcon);
    };

    if (editViewMode === EEditViewMode.EditElement) {
        return (<div className={element_edit_view_container_style}>
            <div className={element_edit_view_content_style}>
                <div className={element_image_style}>
                    <Button
                        variant="contained"
                        component="label"
                        className={upload_btn_style}
                        onMouseEnter={() => setUploadBtnHover(true)}
                        onMouseLeave={() => setUploadBtnHover(false)}
                    >
                        {UploadButtonContent()}
                        <input type="file" className={image_input_style} onChange={onImageFieldChange}></input>
                    </Button>
                </div>
                <TextField
                    label="Element name"
                    variant="outlined"
                    style={{ flex: 1 }}
                    value={elementName}
                    onFocus={() => setShrink(true)}
                    onBlur={(e) => setShrink(!!e.target.value)}
                    InputLabelProps={{ shrink }}
                    onChange={onNameFieldChange}
                />
            </div>
            <div className={footer_buttons_style}>
                <div className="app_spacer"></div>
                <Button variant="outlined" onClick={onCancelButtonClick}>Cancel</Button>
                <Button variant="contained" onClick={createElement} style={{ marginLeft: '10px' }}>Create</Button>
            </div>
        </div>);
    }
    return <></>;
};

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

const footer_buttons_style = css({
    display: 'flex'
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
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -9999,
    top: 0,
    left: 0
});
