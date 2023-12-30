import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { Element } from '../../models/Element';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { getElementImageUrl } from '../../services/CloudinaryService';
import { ELEMENT_SIZE } from '../../utils/css-utils';
import { useAppSelector } from '../../app/hooks';
import { useDrag } from 'react-dnd';
import { ETierlistDragItem } from '../../models/Tierlist';
import { Preview } from 'react-dnd-preview';

// The preview displayed when an element is dragged
// For touch device support, we can't use the default preview used by the HTML d&d api
// Also, we use the react-dnd-preview library because the DragImagePreview doesn't works with TouchBackend
// Cf https://github.com/react-dnd/react-dnd/issues/2206
const generatePreview = ({item, style}: { item: Element, style: React.CSSProperties}) => {
    return <div style={{...style, height: ELEMENT_SIZE, width: ELEMENT_SIZE,}}>
        <img src={getElementImageUrl(item.image)} className={element_img_style}/>
    </div>
};

export interface ElementPreviewProps {  
    element: Element,
    deleteElementHandler?: (elementId: string) => void,
    readonly?: boolean,
    fitToContainer?: boolean
};

const ElementPreview = ({
    element,
    deleteElementHandler,
    readonly = false,
    fitToContainer = false
}: ElementPreviewProps) => {
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [elementImage, setElementImage] = useState<string>();
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ETierlistDragItem.Element,
        item: element,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
        canDrag: () => !readonly
    }), [element]);

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

    const loading: boolean = useAppSelector(state => state.application.loading);

    // Show the delete tier button only on hover
    const DeleteElementButton = (elementId: string): React.JSX.Element | undefined => {
        if (isHovering && deleteElementHandler && !loading) {
            return (
                <div className={element_delete_container_style} data-testid="delete-element">
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
        <Preview>{generatePreview}</Preview>
        <div
            ref={drag}
            className={element_container_style}
            style={{
                height: fitToContainer ? 'unset' : ELEMENT_SIZE,
                width: fitToContainer ? 'unset' : ELEMENT_SIZE,
                opacity: isDragging ? 0.5 : 1,
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            draggable={!readonly}
            data-cy="element-preview"
            data-testid="element-preview"
        >
            <img src={elementImage} className={element_img_style} data-cy="element-preview-img" />
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
    justifyContent: 'center',
    textAlign: 'center',
    aspectRatio: 1,
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
