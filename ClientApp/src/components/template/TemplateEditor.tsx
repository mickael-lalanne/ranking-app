import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import TierEditView from './TierEditView';
import { EEditViewMode, TIERS_COLORS, Template, Tier } from '../../models/Template';
import { Element } from '../../models/Element';
import { css } from '@emotion/css';
import ElementEditView from './ElementEditView';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AppButton from '../shared/AppButton';
import Button from '@mui/material/Button';
import { ERankingLayoutMode, EditorComponentProps } from '../../models/RankingLayout';
import ElementPreview, { element_container_style } from '../shared/ElementPreview';

const TemplateEditor = (
    { saveHandler, itemToEdit, mode }: EditorComponentProps
) => {
    const [tiersToCreate, setTiersToCreate] = useState<Tier[]>([]);
    const [elementsToCreate, setElementsToCreate] = useState<Element[]>([]);
    const [templateName, setTemplateName] = useState<string>('');
    const [saveButtonText, setSaveButtonText] = useState<string>('');
    const [tierHovering, setTierHovering] = useState<number>();
    const [editViewMode, setEditViewMode] = useState<EEditViewMode>(EEditViewMode.Hide);

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
     * Called when a new tier has been created from the Edit view
     * @param {Tier} newTier the tier which was created in the Edit view
     */
    const onTierCreated = (newTier: Tier): void => {
        setTiersToCreate(tiersToCreate.concat(newTier));
        setEditViewMode(EEditViewMode.Hide);
    };

    const onEditViewCancel = () => {
        setEditViewMode(EEditViewMode.Hide);
    };

    /**
     * Called when a new element has been created from the Edit view
     * @param {Element} newElement the element which was created in the Edit view
     */
    const onElementCreated = (newElement: Element): void => {
        setElementsToCreate(elementsToCreate.concat(newElement));
        setEditViewMode(EEditViewMode.Hide);
    };

    /**
     * Called when the save button has been clicked
     */
    const onSaveButtonClick = (): void => {
        const templateToSave: Template = {
            ...itemToEdit as Template,
            name: templateName,
            tiers: tiersToCreate,
            elements: elementsToCreate
        };

        saveHandler(templateToSave);
    };

    // Called when the template name has changed
    const onNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTemplateName(e.target.value);
    };

    // Called when the delete button of a tier has been clicked
    const onTierDeleteButtonClick = (tierId: number) => {
        setTiersToCreate(tiersToCreate.filter(t => t.id !== tierId));
    };

    // Called when the delete button of an element has been clicked
    const onElementDeleteButtonClick = (elementId: number) => {
        setElementsToCreate(elementsToCreate.filter(e => e.id !== elementId));
    };

    /**
     * Display the list of the created tiers
     * @returns {JSX.Element[]} array of created tiers elements
     */
    const CreatedTiers = (): JSX.Element[] => {
        console.log('#CreatedTiers#');
        console.log(tiersToCreate);
        let createdTiersList: JSX.Element[] = [];
        // Sort tiers by rank
        const sortedTiers: Tier[] = tiersToCreate.slice().sort((a, b) => a.rank - b.rank);

        // Show the delete tier button only on hover
        const DeleteTierButton = (tierId: number): React.JSX.Element | undefined => {
            if (tierHovering === tierId) {
                return (
                    <IconButton edge="end" onClick={() => onTierDeleteButtonClick(tierId)} className={delete_btn_style}>
                        <DeleteIcon />
                    </IconButton>
                );
            }
        };

        sortedTiers.forEach(tier => {
            createdTiersList.push(
                <div
                    className={tier_container_style}
                    style={{backgroundColor: TIERS_COLORS[tier.rank]}}
                    onMouseEnter={() => setTierHovering(tier.id)}
                    onMouseLeave={() => setTierHovering(undefined)}
                >
                    <div className={tier_rank_style}>{tier.rank + 1}</div>
                    <div className={tier_name_style}>{tier.name}</div>
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
                <ElementPreview element={element} deleteElementHandler={onElementDeleteButtonClick} />
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
                >
                    Add Tier
                </Button>
            );
        }
        return <></>;
    }

    /**
     * @returns {JSX.Element} the add element button
     */
    const AddElementButton = (): JSX.Element => {
        return (
            <Button
                variant="contained"
                className={add_tier_btn_style + ' ' + element_container_style}
                onClick={() => setEditViewMode(EEditViewMode.EditElement)}
            >
                <AddCircleOutlineIcon style={{ width: '60px', height: '60px' }} />
            </Button>
        );
    }

    return(<>
        <div>
            <TextField
                label="Name"
                variant="outlined"
                color="primary"
                onChange={onNameFieldChange}
                value={templateName}
                fullWidth={true}
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
                {AddElementButton()}
            </div>

            <ElementEditView
                createCallback={onElementCreated}
                cancelCallback={onEditViewCancel}
                editViewMode={editViewMode}
            />
        </div>
        <div className={footer_style}>
            <div className="app_spacer"></div>
            <AppButton text={saveButtonText} onClickHandler={onSaveButtonClick} />
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
    alignItems: 'center'
});

const tier_rank_style = css({
    padding: '0 20px',
    border: '1px solid black',
    height: '100%',
    display: 'flex',
    alignItems: 'center'
});

const tier_name_style = css({
    padding: '0 20px'
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