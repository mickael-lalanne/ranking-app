import React, { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/css';
import { Template } from '../../models/Template';
import { Element, RankedElement } from '../../models/Element';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { EditorComponentProps } from '../../models/RankingLayout';
import RankingGrid from './RankingGrid';
import ToRankSection from './ToRankSection';
import AppButton from '../shared/AppButton';
import { Tierlist } from '../../models/Tierlist';
import { UserId } from '../../models/User';
import { updateLoading } from '../../store/ApplicationStore';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import { getTooltipTitleForSaveButtons } from '../../services/Util';
import InfoBox from '../shared/InfoBox';

// Hack : without an empty template used in the useState default value,
// mui select won't display the value when a tierlist is edited
// That's because when you pass a value to TextField component with undefined,
// the TextField component will assume that is an uncontrolled component.
// Cf https://stackoverflow.com/questions/63567876/react-hooks-not-setting-the-select-value-after-fetching-options
const emptyTemplate: Template = { id: '', name: '', tiers: [], elements: []};

const TierlistsEditor = ({ itemToEdit, saveHandler, mode }: EditorComponentProps) => {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(emptyTemplate);
    const [tierlistName, setTierlistName] = useState<string>('');
    const [rankedElements, setRankedElements] = useState<RankedElement[]>([]);
    const [saveButtonText, setSaveButtonText] = useState<string>('');
    const [disableSave, setDisableSave] = useState<string>('');
    
    const gridRef: React.MutableRefObject<null> = useRef(null);

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
            setTierlistName(itemToEdit.name);
        }
    }, [mode]);

    /**
     * Called when a required field value has changed
     * Check if we have to disable the save button or not
     */
    useEffect(() => {
        let disableMessage: string = '';

        if (!selectedTemplate || !selectedTemplate.id) {
            disableMessage += '- Have a template selected \n';
        }

        if (!tierlistName) {
            disableMessage += '- Have a name \n';
        }

        if (disableMessage.length) {
            disableMessage = 'To be able to save, your tierlist must meet the following requirement(s) : \n' + disableMessage;
        }

        setDisableSave(disableMessage);
    }, [selectedTemplate, tierlistName]);

    const dispatch = useAppDispatch();
    // Retrieve user templates from the store
    const allUserTemplates: Template[] = useAppSelector((state) => state.templates.templates);
    const userId: UserId = useAppSelector(state => state.application.user?.id);
    const loading: boolean = useAppSelector(state => state.application.loading);

    /**
     * Called when a template has been selected
     * @param {React.ChangeEvent<HTMLInputElement>} event select change event
     */
    const handleTemplateSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTemplate(allUserTemplates.find(template => template.id === event.target.value));
    };

    /**
     * Called when the tierlist name has changed
     * @param {React.ChangeEvent<HTMLInputElement>} event text field change event
     */
    const onNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setTierlistName(e.target.value);
    };

    /**
     * Called when an element has been dropped in a cell
     * Update the rankedElement array to includes the new ranked element
     * @param {string} tierId tier where the element has been dropped 
     * @param {number} position position where the element has been dropped
     */
    const onElementDrop = (draggedElement: Element, tierId: string, position: number): void => {
        if (draggedElement && draggedElement.id) {
            const newRankedElement: RankedElement = { elementId: draggedElement.id, tierId, position};
            let rankedElementCopy: RankedElement[] = rankedElements.slice();

            // Index to find out if the dragged element has already been ranked
            const movedEltIndex: number = rankedElements.findIndex(
                elt => elt.elementId === newRankedElement.elementId
            );
            // Index to find out if the cell already contains an element
            const elementOnTargetPositionIndex: number = rankedElements.findIndex(
                elt => elt.tierId === tierId && elt.position === position
            );

            // The dragged element isn't ranked yet => it means it has been dragged from outside the grid
            if (movedEltIndex === -1) {
                // Check if we have to swap the element with an other
                if (elementOnTargetPositionIndex !== -1) {
                    // In this case, we have to unrank the previous element
                    rankedElementCopy = rankedElementCopy.filter(
                        elt => elt.elementId !== rankedElementCopy[elementOnTargetPositionIndex].elementId
                    );
                }
                // Add the dragged element in the ranked array
                setRankedElements(rankedElementCopy.concat(newRankedElement));
            }
            // The dragged element is already ranked => it means it has been moved inside the grid
            else {
                // Check if we have to swap the element with an other
                if (elementOnTargetPositionIndex !== -1) {
                    // In this case, we have to update the position of the previous element
                    rankedElementCopy[elementOnTargetPositionIndex] = {
                        ... rankedElementCopy[elementOnTargetPositionIndex],
                        position: rankedElementCopy[movedEltIndex].position,
                        tierId: rankedElementCopy[movedEltIndex].tierId
                    };
                }
                // Update the dragged element position in the ranked array
                rankedElementCopy[movedEltIndex] = newRankedElement;
                setRankedElements(rankedElementCopy);
            }
        }
    };

    /**
     * Called when the delete icon of a ranked element has been click
     * @param {string} elementId id of the element to unrank
     */
    const onElementUnrank = (elementId: string) => {
        setRankedElements(rankedElements.filter(elt => elt.elementId !== elementId));
    };

    /**
     * Called when the save button has been clicked
     */
    const onSaveButtonClick = (): void => {
        if (selectedTemplate && selectedTemplate.id) {
            // Show loading indicator
            dispatch(updateLoading(true));

            const tierlistToSave: Tierlist = {
                ...itemToEdit as Tierlist,
                name: tierlistName,
                rankedElements: rankedElements,
                templateId: selectedTemplate.id,
                userId
            };
            saveHandler(tierlistToSave);
        }
    };

    /**
     * Called when the download button has been clicked
     * Convert the grid to a canvas using the html2canvas library and download it as png
     */
    const downloadTierlist = async (): Promise<void> => {
        if (gridRef.current) {
            const gridCanvas: HTMLCanvasElement = await html2canvas(gridRef.current, { useCORS: true });
            const link: HTMLAnchorElement = document.createElement('a');
            link.download = itemToEdit?.name + '.png';
            link.href = gridCanvas.toDataURL();
            link.click();
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

    /**
     * @returns {React.JSX.Element} the name field if a template is selected, otherwise a custom message
     */
    const NameField = () => {
        // Show the name field only if a template is selected
        if (selectedTemplate && selectedTemplate.id) {
            return <TextField
                label="Name"
                variant="outlined"
                color="primary"
                onChange={onNameFieldChange}
                style={{ marginBottom: '40px' }}
                value={tierlistName}
                fullWidth={true}
                disabled={loading}
            />;
        }
        // Otherwise, display a custom message to encourage the user to select a template
        else {
            return <InfoBox
                content="🡹 To be able to create a tierlist, you must first select a template in the list above."
            />
        }
    };

    return(<>
        <div>
            {TemplateSelector()}
            {NameField()}

            <RankingGrid
                innerRef={gridRef}
                template={selectedTemplate}
                rankedElements={[...rankedElements]}
                dropHandler={onElementDrop}
            />

            {selectedTemplate && selectedTemplate.id && <ToRankSection
                template={selectedTemplate}
                rankedElements={[...rankedElements]}
                unrankHandler={onElementUnrank}
            />}
        </div>
        
        <div className={footer_style}>
            <div className="app_spacer"></div>
            <Tooltip title={getTooltipTitleForSaveButtons(disableSave)}>
                <div>
                    <AppButton
                        text={saveButtonText}
                        onClickHandler={onSaveButtonClick}
                        disabled={loading || !!disableSave}
                    />
                </div>
            </Tooltip>
            <Tooltip title="Download as PNG">
                <div>
                    <Button
                        onClick={downloadTierlist}
                        className={download_btn_style}
                        disabled={!selectedTemplate || !selectedTemplate.id}
                    >
                        <DownloadIcon style={{ height: '32px', width: '32px' }} />
                    </Button>
                </div>
            </Tooltip>
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
    alignItems: 'center',
    margin: '20px 0'
});

const download_btn_style = css({
    marginLeft: '10px !important',
    aspectRatio: 1
});
