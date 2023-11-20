import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import TierEditView from './TierEditView';
import { ETemplateMode, TIERS_COLORS, Template, Tier } from '../../models/Template';
import { Element } from '../../models/Element';
import { css } from '@emotion/css';
import ElementEditView from './ElementEditView';
import TmpElementImg from '../../images/tmp_element_img.png';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AppButton from '../shared/AppButton';
import { useTheme } from '@mui/material/styles';

const TemplateEditor = (
    { saveHandler, template, mode }: {
        saveHandler: (templateToCreate: Template) => Promise<void>,
        template?: Template,
        mode: ETemplateMode
    }
) => {
    const [tiersToCreate, setTiersToCreate] = useState<Tier[]>([]);
    const [elementsToCreate, setElementsToCreate] = useState<Element[]>([]);
    const [templateName, setTemplateName] = useState<string>('');
    const [saveButtonText, setSaveButtonText] = useState<string>('');
    const [tierHovering, setTierHovering] = useState<number>();
    const [elementHovering, setElementHovering] = useState<number>();

    const theme = useTheme();

    /**
     * Called when in Edit mode to set the existing template informations
     */
    useEffect(() => {
        if (mode === ETemplateMode.Editor && template) {
            setTiersToCreate(template.tiers);
            setElementsToCreate(template.elements);
            setTemplateName(template.name);
            setSaveButtonText('Edit template');
        }

        if (mode === ETemplateMode.Builder) {
            setSaveButtonText('Create template');
        }
    }, [mode]);

    /**
     * Called when a new tier has been created from the Edit view
     * @param {Tier} newTier the tier which was created in the Edit view
     */
    const onTierCreated = (newTier: Tier): void => {
        setTiersToCreate(tiersToCreate.concat(newTier))
    };

    /**
     * Called when a new element has been created from the Edit view
     * @param {Element} newElement the element which was created in the Edit view
     */
    const onElementCreated = (newElement: Element): void => {
        setElementsToCreate(elementsToCreate.concat(newElement))
    };

    /**
     * Called when the save button has been clicked
     */
    const onSaveButtonClick = (): void => {
        const templateToSave: Template = {
            ...template,
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
        let createdTiersList: JSX.Element[] = [];
        // Sort tiers by rank
        const sortedTiers: Tier[] = tiersToCreate.sort((a, b) => a.rank - b.rank);

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

        // Show the delete tier button only on hover
        const DeleteElementButton = (elementId: number): React.JSX.Element | undefined => {
            if (elementHovering === elementId) {
                return (
                    <div className={element_delete_container_style}>
                        <RemoveCircleOutlineIcon
                            onClick={() => onElementDeleteButtonClick(elementId)}
                            className={remove_element_icon_style}
                        />
                        <div className={element_delete_bg_style}></div>
                    </div>
                );
            }
        };

        elementsToCreate.forEach(element => {
            createdElementsList.push(
                <div
                    className={element_container_style}
                    onMouseEnter={() => setElementHovering(element.id)}
                    onMouseLeave={() => setElementHovering(undefined)}
                >
                    <img src={TmpElementImg} style={{width: '50px'}} />
                    <div className="app_text_ellipsis">{element.name}</div>
                    {DeleteElementButton(element.id!)}
                </div>
            );
        });
        return createdElementsList;
    };

    return(<>
        <div>
        <TextField
            label="Name"
            variant="outlined"
            onChange={onNameFieldChange}
            value={templateName}
            fullWidth={true}
        />

        <div>Tiers :</div>
        <div>
            {CreatedTiers()}
        </div>

        <TierEditView existingTiers={tiersToCreate} createCallback={onTierCreated} />

        <div>Elements :</div>
        <div className={elements_container_style}>
            {CreatedElements()}
        </div>

        <ElementEditView createCallback={onElementCreated} />
        </div>
        <div className={footer_style}>
            <div className="app_spacer"></div>
            <AppButton text={saveButtonText} onClickHandler={onSaveButtonClick} />
        </div>
    </>);
};

export default TemplateEditor;

/**
 * CSS STYLES
 */
const tier_container_style = css({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '50px',
    marginTop: '5px'
});

const elements_container_style = css({
    display: 'flex',
    alignItems: 'center'
});

const element_container_style = css({
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    border: '1px solid',
    flexDirection: 'column',
    width: '100px',
    height: '100px',
    padding: '5px',
    margin: '5px',
    justifyContent: 'center',
    textAlign: 'center'
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

const delete_btn_style = css({
    margin: '0 15px !important'
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

const footer_style = css({
    display: 'flex',
    margin: '20px 0'
});
