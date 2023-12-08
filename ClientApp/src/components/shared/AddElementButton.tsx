import React from 'react';
import { css } from '@emotion/css';
import { element_container_style } from '../shared/ElementPreview';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';

const AddElementButton = (
    { changeCallback } : {
        changeCallback: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }
) => {
    return(
        <Button
            variant="contained"
            component="label"
            className={element_container_style + ' ' + add_elt_btn_style}
        >
            <AddCircleOutlineIcon style={{ width: '40px', height: '40px' }} />
            <input
                type="file"
                multiple
                className={add_element_input_style}
                onChange={changeCallback}
            ></input>
        </Button>
    );
};

export default AddElementButton;

/**
 * CSS STYLES
 */
const add_elt_btn_style = css({
    margin: '0 !important',
    width: '60px',
    height: '60px !important',
    minWidth: 0
});

const add_element_input_style = css({
    opacity: 0,
    zIndex: -9999,
    height: 0
});
