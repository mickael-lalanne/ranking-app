import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { css } from '@emotion/css';
import { Element } from '../../models/Element';
import { generateRandomId } from '../../services/Util';

enum ElementViewMode {
    Edit = 'edit', // When user wants to edit an element 
    Create = 'create', // When user wants to create a element
    Hide = 'hide' // When the view isn't displayed
};

/**
 * View displayed when the user wants to create a new element or edit an existing one
 */
const ElementEditView = ({createCallback}: {
    createCallback: (element: Element) => void,
}) => {
    const [elementEditView, setElementEditView] = useState<ElementViewMode>(ElementViewMode.Hide);
    const [elementName, setElementName] = useState<string>();

    // Called when the "Add element" button has been clicked
    const showCreateView = () => {
        setElementEditView(ElementViewMode.Create);
    };

    // Called when the "Cancel" button of the edit view has been clicked 
    const hideEditView = () => {
        setElementEditView(ElementViewMode.Hide);
    };

    // Called when the "Create" button of the edit view has been clicked
    const createElement = () => {
        createCallback({
            id: generateRandomId(),
            name: elementName as string,
            image: 'tmp_img'
        });
        setElementEditView(ElementViewMode.Hide);
    };

    // Called when the element name has changed
    const onNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setElementName(e.target.value);
    };

    if (elementEditView !== ElementViewMode.Hide) {
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
                <Button variant="outlined" onClick={hideEditView}>Cancel</Button>
                <Button variant="contained" onClick={createElement} style={{ marginLeft: '10px' }}>Create</Button>
            </div>
        </div>);
    }

    return <Button variant="contained" className={add_btn_style} onClick={showCreateView}>Add Element</Button>;
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

const add_btn_style = css({
    marginTop: '5px'
});