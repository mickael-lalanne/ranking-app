import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import TierEditView from './TierEditView';
import { TIERS_COLORS, Template, Tier } from '../../models/Template';
import { Element } from '../../models/Element';
import { css } from '@emotion/css';
import ElementEditView from './ElementEditView';
import TmpElementImg from '../../images/tmp_element_img.png';
import Button from '@mui/material/Button';

const TemplateBuilder = () => {
    const [tiersToCreate, setTiersToCreate] = useState<Tier[]>([]);
    const [elementsToCreate, setElementsToCreate] = useState<Element[]>([]);
    const [templateToCreate, setTemplateToCreate] = useState<Template>();
    const [templateName, setTemplateName] = useState<string>('');

    /**
     * Called when a template has been created
     * Send a post request to the server to create the template in the database
     */
    useEffect(() => {
        if (!templateToCreate) { return; }

        // Get all user templates from the database
        const postTemplate: () => Promise<void> = async () => {
            const requestOptions: RequestInit = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(templateToCreate)
            };

            const serverResponse = await fetch('template', requestOptions);

            // Reset data
            setTemplateToCreate(undefined);
            setTiersToCreate([]);
            setElementsToCreate([]);
            setTemplateName('');
        };
        postTemplate()
            .catch(err => {
                // TODO: handle errors
            });
    }, [templateToCreate]);

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
     * Called when "Create Template" button has been clicked
     */
    const createTemplate = (): void => {
        setTemplateToCreate({
            name: templateName,
            tiers: tiersToCreate,
            elements: elementsToCreate
        });
    };

    // Called when the template name has changed
    const onNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTemplateName(e.target.value);
    };

    /**
     * Display the list of the created tiers
     * @returns {JSX.Element[]} array of created tiers elements
     */
    const CreatedTiers = (): JSX.Element[] => {
        let createdTiersList: JSX.Element[] = [];
        // Display tiers by rank
        const sortedTiers: Tier[] = tiersToCreate.sort((a, b) => a.rank - b.rank);

        sortedTiers.forEach(tier => {
            createdTiersList.push(<div className={tier_container_style} style={{backgroundColor: TIERS_COLORS[tier.rank]}}>
                <div className={tier_rank_style}>{tier.rank + 1}</div>
                <div className={tier_name_style}>{tier.name}</div>
            </div>);
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
            createdElementsList.push(<div className={element_container_style}>
                <img src={TmpElementImg} style={{width: '50px'}} />
                <div className="app_text_ellipsis">{element.name}</div>
            </div>);
        });
        return createdElementsList;
    };

    return(<>
        <div>Create a template :</div>
        <TextField label="Name" variant="outlined" onChange={onNameFieldChange} />

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

        <Button variant="contained" onClick={createTemplate}>Create Template</Button>
    </>);
};

export default TemplateBuilder;

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
