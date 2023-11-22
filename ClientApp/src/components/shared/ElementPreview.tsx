import React, { useState } from 'react';
import { css } from '@emotion/css';
import { Element } from '../../models/Element';
import TmpElementImg from '../../images/tmp_element_img.png';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const ElementPreview = ({ element, deleteElementHandler }: {
    element: Element,
    deleteElementHandler?: (elementId: number) => void,
}) => {
    const [isHovering, setIsHovering] = useState<boolean>(false);

    // Show the delete tier button only on hover
    const DeleteElementButton = (elementId: number): React.JSX.Element | undefined => {
        if (isHovering && deleteElementHandler) {
            return (
                <div className={element_delete_container_style}>
                    <RemoveCircleOutlineIcon
                        onClick={() => deleteElementHandler(elementId)}
                        className={remove_element_icon_style}
                    />
                    <div className={element_delete_bg_style}></div>
                </div>
            );
        }
    };

    return(<>
        <div
            className={element_container_style}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <img src={TmpElementImg} style={{width: '50px'}} />
            <div className="app_text_ellipsis">{element.name}</div>
            {DeleteElementButton(element.id!)}
        </div>
    </>);
};

export default ElementPreview;

/**
 * CSS STYLES
 */
export const element_container_style = css({
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    border: '1px solid',
    flexDirection: 'column',
    width: '100px !important',
    height: '100px !important',
    padding: '5px !important',
    margin: '5px !important',
    justifyContent: 'center',
    textAlign: 'center'
});

const element_delete_container_style = css({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
});

const element_delete_bg_style = css({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    opacity: 0.7,
    backgroundColor: 'black',
    zIndex: -1
});

const remove_element_icon_style = css({
    color: 'white',
    width: '65px !important',
    height: '65px !important',
    cursor: 'pointer'
});
