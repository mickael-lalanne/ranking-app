import React from 'react';
import { css } from '@emotion/css';
import { element_container_style } from '../shared/ElementPreview';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import { ELEMENT_SIZE } from '../../utils/css-utils';

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
                accept="image/*"
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
    width: ELEMENT_SIZE,
    height: ELEMENT_SIZE,
    minWidth: '0 !important'
});

const add_element_input_style = css({
    opacity: 0,
    zIndex: -9999,
    height: 0
});
