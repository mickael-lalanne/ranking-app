import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import TierEditView from './TierEditView';
import { EEditViewMode, TIERS_COLORS, Template, Tier } from '../../models/Template';
import { Element } from '../../models/Element';
import { css } from '@emotion/css';
import ElementEditView from './ElementEditView';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AppButton from '../shared/AppButton';
import Button from '@mui/material/Button';
import { ERankingLayoutMode, EditorComponentProps } from '../../models/RankingLayout';
import ElementPreview from '../shared/ElementPreview';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { UserId } from '../../models/User';
import { deleteElementsImages, uploadElementsImages } from '../../services/CloudinaryService';
import AddElementButton from '../shared/AddElementButton';
import { ResizedImage, generateRandomId, getTooltipTitleForSaveButtons, isTemporaryId, resizeImage } from '../../services/Util';
import { updateLoading } from '../../store/ApplicationStore';
import { Tooltip } from '@mui/material';

const DEFAULT_TIERS: Tier[] = [
    { id: generateRandomId(), name: 'Tier 1', rank: 0 },
    { id: generateRandomId(), name: 'Tier 2', rank: 1 },
    { id: generateRandomId(), name: 'Tier 2', rank: 2 },
    { id: generateRandomId(), name: 'Tier 4', rank: 3 },
    { id: generateRandomId(), name: 'Tier 5', rank: 4 },
];

const TemplateEditor = (
    { saveHandler, itemToEdit, mode }: EditorComponentProps
) => {
    const [tiersToCreate, setTiersToCreate] = useState<Tier[]>(DEFAULT_TIERS);
    const [elementsToCreate, setElementsToCreate] = useState<Element[]>([]);
    const [elementsImages, setElementsImages] = useState<ResizedImage[]>([]);
    const [templateName, setTemplateName] = useState<string>('');
    const [saveButtonText, setSaveButtonText] = useState<string>('');
    const [tierHovering, setTierHovering] = useState<string>();
    const [editViewMode, setEditViewMode] = useState<EEditViewMode>(EEditViewMode.Hide);
    const [disableSave, setDisableSave] = useState<string>('');

    /**
     * Called when in Edit mode to set the existing template informations
     */
    useEffect(() => {
        if (mode === ERankingLayoutMode.Editor && itemToEdit) {
            setTiersToCreate((itemToEdit as Template).tiers);
            setElementsToCreate((itemToEdit as Template).elements);
            setTemplateName((itemToEdit as Template).name);
            setSaveButtonText('Edit template');
        }

        if (mode === ERankingLayoutMode.Builder) {
            setSaveButtonText('Create template');
        }
    }, [mode]);

    /**
     * Called when a required field value has changed
     * Check if we have to disable the save button or not
     */
    useEffect(() => {
        let disableMessage: string = '';

        if (templateName.length === 0) {
            disableMessage += '- Have a name \n';
        }

        if (tiersToCreate.length === 0) {
            disableMessage += '- Have at least 1 tier \n';
        }

        if (elementsToCreate.length === 0) {
            disableMessage += '- Have at least 1 element \n';
        }

        if (disableMessage.length) {
            disableMessage = 'To be able to save, your template must meet the following requirement(s) : \n' + disableMessage;
        }

        setDisableSave(disableMessage);
    }, [templateName, tiersToCreate, elementsToCreate]);

    const dispatch = useAppDispatch();
    const userId: UserId = useAppSelector(state => state.application.user?.id);
    const loading: boolean = useAppSelector(state => state.application.loading);

    /**
     * Called when a new tier has been created from the Edit view
     * @param {Tier} newTier the tier which was created in the Edit view
     */
    const onTierCreated = (newTier: Tier): void => {
        setTiersToCreate(tiersToCreate.concat(newTier));
        setEditViewMode(EEditViewMode.Hide);
    };

    const onEditViewCancel = () => {
        setEditViewMode(EEditViewMode.Hide);
        setElementsImages([]);
    };

    /**
     * Called when a new element has been created from the Edit view
     * @param {Element[]} newElements the elements which was created in the Edit view
     */
    const onElementCreated = (newElements: Element[]): void => {
        setElementsToCreate(elementsToCreate.concat(newElements));
        setEditViewMode(EEditViewMode.Hide);
    };

    /**
     * Called when the save button has been clicked
     */
    const onSaveButtonClick = async (): Promise<void> => {
        // Show loading indicator
        dispatch(updateLoading(true));

        let elementsWithUploadedImages: Element[] = [];

        // For CREATION, upload ALL the elements images to cloudinary
        if (mode === ERankingLayoutMode.Builder) {
            elementsWithUploadedImages =
                await uploadElementsImages(elementsToCreate, userId!);
        }
        // For EDITION
        else if (mode === ERankingLayoutMode.Editor) {
            // Upload ONLY images that have not already been uploaded
            const elementsAlreadyCreated: Element[] = elementsToCreate.filter(elt => !isTemporaryId(elt.id!));
            const elementsNotYetCreated: Element[] = elementsToCreate.filter(elt => isTemporaryId(elt.id!));

            const newElementsWithImages: Element[] = await uploadElementsImages(elementsNotYetCreated, userId!);

            elementsWithUploadedImages = elementsAlreadyCreated.concat(newElementsWithImages);

            // AND
            // Delete from cloudinary the images that have been removed
            const elementsToDelete: Element[] = (itemToEdit as Template).elements.filter(
                elt => !elementsToCreate.includes(elt)
            );
            await deleteElementsImages(elementsToDelete);
        }

        // Then, save the template in database
        const templateToSave: Template = {
            ...itemToEdit as Template,
            name: templateName,
            tiers: tiersToCreate,
            elements: elementsWithUploadedImages,
            userId
        };

        saveHandler(templateToSave);
    };

    // Called when the template name has changed
    const onNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setTemplateName(e.target.value);
    };

    // Called when a tier name has been changed
    const onTierNameFieldChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        tierId: string
    ): void => {
        // Create copy to avoid "Cannot assign to read only property 'name' of object" error
        // It's because tiers have a reference to the redux store
        const tiersCopy: Tier[] = JSON.parse(JSON.stringify(tiersToCreate)); 
        const tierToEditIndex: number = tiersCopy.findIndex(t => t.id === tierId);
        if (tierToEditIndex !== -1) {
            tiersCopy[tierToEditIndex].name = e.target.value;
            setTiersToCreate(tiersCopy);
        }
    };

    // Called when the delete button of a tier has been clicked
    const onTierDeleteButtonClick = (tierId: string) => {
        setTiersToCreate(tiersToCreate.filter(t => t.id !== tierId));
    };

    // Called when the delete button of an element has been clicked
    const onElementDeleteButtonClick = (elementId: string) => {
        setElementsToCreate(elementsToCreate.filter(e => e.id !== elementId));
    };

    // Called when the user has selected one or many images for its elements
    const onElementImageInputChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        if (e.target.files) {
            const resizeFilePromises: Promise<ResizedImage>[] = [];

            // Resize all images selectionned by the user
            Array.from(e.target.files).forEach(file => {
                resizeFilePromises.push(resizeImage(file));
            });

            // Once all images have been resized
            const resizedImages: ResizedImage[] = await Promise.all(resizeFilePromises);

            setElementsImages(resizedImages);
            setEditViewMode(EEditViewMode.EditElement);
        }
    };

    /**
     * Display the list of the created tiers
     * @returns {JSX.Element[]} array of created tiers elements
     */
    const CreatedTiers = (): JSX.Element[] => {
        let createdTiersList: JSX.Element[] = [];
        // Sort tiers by rank
        const sortedTiers: Tier[] = tiersToCreate.slice().sort((a, b) => a.rank - b.rank);

        // Show the delete tier button only on hover
        const DeleteTierButton = (tierId: string): React.JSX.Element | undefined => {
            if (tierHovering === tierId && !loading) {
                return (
                    <IconButton
                        edge="end"
                        onClick={() => onTierDeleteButtonClick(tierId)}
                        className={delete_btn_style}
                        data-cy="delete-tier-button"
                    >
                        <DeleteIcon />
                    </IconButton>
                );
            }
        };

        sortedTiers.forEach(tier => {
            createdTiersList.push(
                <div
                    className={tier_container_style}
                    key={tier.id}
                    style={{backgroundColor: TIERS_COLORS[tier.rank]}}
                    onMouseEnter={() => setTierHovering(tier.id)}
                    onMouseLeave={() => setTierHovering(undefined)}
                    data-cy="template-tier-in-editor"
                >
                    <div className={tier_rank_style}>{tier.rank + 1}</div>
                    <TextField
                        className={tier_name_style}
                        variant="standard"
                        onChange={e => onTierNameFieldChange(e, tier.id!)}
                        value={tier.name}
                        fullWidth
                        disabled={loading}
                        data-cy="tier-name-field"
                    />
                    <div className="app_spacer"></div>
                    {DeleteTierButton(tier.id!)}
                </div>
            );
        });
        return createdTiersList;
    };

    /**
     * Display the list of the created elements
     * @returns {JSX.Element[]} array of created elements
     */
    const CreatedElements = (): JSX.Element[] => {
        let createdElementsList: JSX.Element[] = [];

        elementsToCreate.forEach(element => {
            createdElementsList.push(
                <ElementPreview element={element} key={element.id} deleteElementHandler={onElementDeleteButtonClick} readonly />
            );
        });
        return createdElementsList;
    };

    /**
     * @returns {JSX.Element} the add tier button only if a tier can be created
     */
    const AddTierButton = (): JSX.Element => {
        if (tiersToCreate.length < 5) {
            return (
                <Button
                    variant="contained"
                    className={add_tier_btn_style}
                    onClick={() => setEditViewMode(EEditViewMode.EditTier)}
                    disabled={loading}
                    data-cy="add-tier-button"
                >
                    Add Tier
                </Button>
            );
        }
        return <></>;
    }

    /**
     * @returns {JSX.Element} the add element button if the edit view is not displayed
     */
    const ShowAddElementButton = (): JSX.Element | undefined => {
        if (editViewMode !== EEditViewMode.EditElement) {
            return <div style={{ marginLeft: '5px'}}> 
                <AddElementButton changeCallback={onElementImageInputChange} />
            </div>;
        }
    }

    return(<>
        <div>
            <TextField
                label="Name"
                variant="outlined"
                color="primary"
                data-cy="template-name"
                onChange={onNameFieldChange}
                value={templateName}
                fullWidth={true}
                disabled={loading}
            />

            <div className={editor_title_style}>Tiers :</div>
            <div>
                {CreatedTiers()}
            </div>

            {AddTierButton()}
            <TierEditView
                existingTiers={tiersToCreate}
                createCallback={onTierCreated}
                cancelCallback={onEditViewCancel}
                editViewMode={editViewMode}
            />

            <div className={editor_title_style}>Elements :</div>
            <div className={elements_container_style}>
                {CreatedElements()}
                {ShowAddElementButton()}
            </div>

            <ElementEditView
                createCallback={onElementCreated}
                cancelCallback={onEditViewCancel}
                defaultImages={elementsImages}
                editViewMode={editViewMode}
            />
        </div>
        <div className={footer_style}>
            <div className="app_spacer"></div>
            <Tooltip title={getTooltipTitleForSaveButtons(disableSave)}>
                <div data-cy="create-template">
                    <AppButton
                        text={saveButtonText}
                        onClickHandler={onSaveButtonClick}
                        disabled={loading || !!disableSave}
                    />
                </div>
            </Tooltip>
        </div>
    </>);
};

export default TemplateEditor;

const TIER_HEIGHT:  string = '50px';
const TIER_MARGIN_TOP:  string = '5px !important';
/**
 * CSS STYLES
 */
const tier_container_style = css({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: TIER_HEIGHT,
    marginTop: TIER_MARGIN_TOP
});

const elements_container_style = css({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
});

const tier_rank_style = css({
    padding: '0 20px',
    border: '1px solid black',
    height: '100%',
    display: 'flex',
    alignItems: 'center'
});

const tier_name_style = css({
    padding: '0 20px !important',
    ".MuiInputBase-root:hover:before": {
        borderBottom: '1.5px solid black !important'
    },
    ".MuiInputBase-root:after": {
        borderBottom: '2.2px solid black'
    },
    ".MuiInputBase-root:before": {
        borderBottom: 0
    }
});

const editor_title_style = css({
    margin: '20px 0',
    fontFamily: '"Raleway", sans-serif',
    fontWeight: 300,
    fontSize: '17px'
});

const delete_btn_style = css({
    margin: '0 15px !important'
});

const footer_style = css({
    display: 'flex',
    margin: '20px 0'
});

const add_tier_btn_style = css({
    marginTop: TIER_MARGIN_TOP,
    width: '100%',
    height: TIER_HEIGHT
});
