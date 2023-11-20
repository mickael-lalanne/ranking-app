import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { css } from '@emotion/css';
import { Element } from '../../models/Element';
import { generateRandomId } from '../../services/Util';
import { EEditViewMode } from '../../models/Template';

/**
 * View displayed when the user wants to create a new element or edit an existing one
 */
const ElementEditView = ({createCallback, cancelCallback, editViewMode}: {
    createCallback: (element: Element) => void,
    cancelCallback: () => void,
    editViewMode: EEditViewMode
}) => {
    const [elementName, setElementName] = useState<string>();

    // Called when the "Create" button of the edit view has been clicked
    const createElement = () => {
        createCallback({
            id: generateRandomId(),
            name: elementName as string,
            image: 'tmp_img'
        });
    };

    // Called when the element name has changed
    const onNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setElementName(e.target.value);
    };

    if (editViewMode === EEditViewMode.EditElement) {
        return (<div className={element_edit_view_container_style}>
            <TextField
                label="Element name"
                variant="outlined"
                onChange={onNameFieldChange}
            />
            <div className={element_image_style}>
                <div>Image :</div>
                <div>Todo...</div>
            </div>
            <div className={footer_buttons_style}>
                <div className="app_spacer"></div>
                <Button variant="outlined" onClick={cancelCallback}>Cancel</Button>
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

const footer_buttons_style = css({
    display: 'flex'
});

const element_image_style = css({
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px'
})
