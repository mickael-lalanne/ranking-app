import React, { useState } from 'react';
import { css } from '@emotion/css';
import { Element } from '../../models/Element';
import TmpElementImg from '../../images/tmp_element_img.png';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const ElementPreview = ({ element, deleteElementHandler, dragStartHandler, dragEndHandler, readonly = false }: {
    element: Element,
    deleteElementHandler?: (elementId: number) => void,
    dragStartHandler?: (element: Element) => void,
    dragEndHandler?: () => void,
    readonly?: boolean
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
            onDragStart={e => dragStartHandler ? dragStartHandler(element) : undefined}
            onDragEnd={() => dragEndHandler ? dragEndHandler() : undefined}
            onDragOver={e => e.preventDefault()}
            draggable={!readonly}
        >
            <img src={TmpElementImg} className={element_img_style} />
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
    height: '100% !important',
    padding: '5px !important',
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

const element_img_style = css({
    maxWidth: '100%',
    maxHeight: '100%',
    height: 'auto',
    width: 'auto'
});
