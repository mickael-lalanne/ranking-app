import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { Template } from '../../models/Template';
import { Element, RankedElement } from '../../models/Element';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useAppSelector } from '../../app/hooks';
import { EditorComponentProps } from '../../models/RankingLayout';
import RankingGrid from './RankingGrid';
import ToRankSection from './ToRankSection';
import AppButton from '../shared/AppButton';
import { Tierlist } from '../../models/Tierlist';
import { UserId } from '../../models/User';

// Hack : without an empty template used in the useState default value,
// mui select won't display the value when a tierlist is edited
// That's because when you pass a value to TextField component with undefined,
// the TextField component will assume that is an uncontrolled component.
// Cf https://stackoverflow.com/questions/63567876/react-hooks-not-setting-the-select-value-after-fetching-options
const emptyTemplate: Template = { id: '', name: '', tiers: [], elements: []};

const TierlistsEditor = ({ itemToEdit, saveHandler, mode }: EditorComponentProps) => {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(emptyTemplate);
    const [draggedElement, setDraggedElement] = useState<Element>();
    const [rankedElements, setRankedElements] = useState<RankedElement[]>([]);
    const [saveButtonText, setSaveButtonText] = useState<string>('');

    useEffect(() => {
        setSaveButtonText(itemToEdit ? 'Save changes' : 'Create tierlist');

        if (itemToEdit) {
            const templateToSelect: Template | undefined = allUserTemplates.find(
                t => t.id === (itemToEdit as Tierlist).templateId
            );
            if (templateToSelect) {
                setSelectedTemplate(templateToSelect);
            }
            setRankedElements((itemToEdit as Tierlist).rankedElements);
        }
    }, [mode]);

    // Retrieve user templates from the store
    const allUserTemplates: Template[] = useAppSelector((state) => state.templates.templates);
    const userId: UserId= useAppSelector(state => state.user.user?.id);

    /**
     * Called when a template has been selected
     * @param {React.ChangeEvent<HTMLInputElement>} event select change event
     */
    const handleTemplateSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTemplate(allUserTemplates.find(template => template.id === event.target.value));
    };

    /**
     * Called when en element start to be dragged
     * @param {Element} element the element being dragged 
     */
    const onElementDragStart = (element: Element): void => {
        setDraggedElement(element);
    };

    /**
     * Called when an element drag has been stopped
     */
    const onElementDragEnd = (): void => {
        setDraggedElement(undefined);
    };

    /**
     * Called when an element has been dropped in a cell
     * Update the rankedElement array to includes the new ranked element
     * @param {string} tierId tier where the element has been dropped 
     * @param {number} position position where the element has been dropped
     */
    const onElementDrop = (tierId: string, position: number): void => {
        if (draggedElement && draggedElement.id) {
            const newRankedElement: RankedElement = { elementId: draggedElement.id, tierId, position};

            const rankedEltIndex: number = rankedElements.findIndex(
                elt => elt.elementId === newRankedElement.elementId
            );

            // If element has been dropped for the not ranked list, add it to the rankedElements array
            if (rankedEltIndex === -1) {
                setRankedElements(rankedElements.concat(newRankedElement));
            }
            //  If the element has already been ranked, when its position has been changed, update the rankedElements array
            else {
                const rankedElementCopy: RankedElement[] = rankedElements.slice();
                rankedElementCopy[rankedEltIndex] = newRankedElement;
                setRankedElements(rankedElementCopy);
            }
        }

        setDraggedElement(undefined);
    };

    /**
     * Called when the save button has been clicked
     */
    const onSaveButtonClick = (): void => {
        if (selectedTemplate && selectedTemplate.id) {
            const tierlistToSave: Tierlist = {
                ...itemToEdit as Tierlist,
                name: 'Todo',
                rankedElements: rankedElements,
                templateId: selectedTemplate.id,
                userId
            };
            saveHandler(tierlistToSave);
        }
    };

    /**
     * @returns {React.JSX.Element} a Select HTML Element to choose the template used for the tierlist
     */
    const TemplateSelector = (): React.JSX.Element => {
        const AllTemplatesMenuItem = (): React.JSX.Element[] => {
            const items: React.JSX.Element[] = [];
            allUserTemplates.forEach(template => {
                items.push(<MenuItem key={template.id} value={template.id}>{template.name}</MenuItem>);
            });
            return items;
        };

        return (
            <TextField
                value={selectedTemplate?.id}
                className={template_select_style}
                label="Template"
                select
                onChange={handleTemplateSelectChange}
            >
                {AllTemplatesMenuItem()}
            </TextField>
        )
    };

    return(<>
        <div>
            {TemplateSelector()}

            <RankingGrid
                template={selectedTemplate}
                rankedElements={rankedElements}
                dropHandler={onElementDrop}
                dragStartHandler={onElementDragStart}
                dragEndHandler={onElementDragEnd}
            />

            <ToRankSection
                template={selectedTemplate}
                rankedElements={rankedElements}
                dragStartHandler={onElementDragStart}
                dragEndHandler={onElementDragEnd}
            />
        </div>
        
        <div className={footer_style}>
            <div className="app_spacer"></div>
            <AppButton
                text={saveButtonText}
                onClickHandler={onSaveButtonClick}
                disabled={!selectedTemplate}
            />
        </div>
    </>);
};

export default TierlistsEditor;

/**
 * CSS STYLES
 */
const template_select_style = css({
    height: '40px',
    width: '100%',
    marginBottom: '40px !important'
});

const footer_style = css({
    display: 'flex',
    margin: '20px 0'
});
