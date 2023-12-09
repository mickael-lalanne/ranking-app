import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { Element } from '../../models/Element';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { getElementImageUrl } from '../../services/CloudinaryService';
import { ELEMENT_SIZE } from '../../utils/css-utils';

const ElementPreview = ({
    element,
    deleteElementHandler, dragStartHandler, dragEndHandler,
    readonly = false
}: {
    element: Element,
    deleteElementHandler?: (elementId: number) => void,
    dragStartHandler?: (element: Element) => void,
    dragEndHandler?: () => void,
    readonly?: boolean
}) => {
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [elementImage, setElementImage] = useState<string>();

    // Called when the component is initialized and when the element prop has changed
    useEffect(() => {
        if (element.image) {
            const elementImage: string = !element.image.startsWith('data:image/png')
                // If file don't start with data:image/png, it means the image has already been uploaded to Cloudinary
                ? getElementImageUrl(element.image)
                // Otherwise, it means the element is not created yet, so use the data URI of the resized image
                : element.image;
            setElementImage(elementImage);
        }
    }, [element]);

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
            <img src={elementImage} className={element_img_style} />
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
    height: ELEMENT_SIZE,
    justifyContent: 'center',
    textAlign: 'center',
    aspectRatio: 1,
    width: ELEMENT_SIZE
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
    height: '100%',
    width: '100%',
    objectFit: 'cover'
});
