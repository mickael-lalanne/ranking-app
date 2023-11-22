import React, { useState } from 'react';
import { css } from '@emotion/css';
import { Template } from '../../models/Template';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useAppSelector } from '../../app/hooks';
import { EditorComponentProps } from '../../models/RankingLayout';
import RankingGrid from './RankingGrid';

const TierlistsEditor = ({ itemToEdit }: EditorComponentProps) => {
    const [selectedTemplate, setSelectedTemplate] = useState<Template>();

    // Retrieve user templates from the store
    const allUserTemplates: Template[] = useAppSelector((state) => state.templates.templates);

    /**
     * Called when a template has been selected
     * @param {React.ChangeEvent<HTMLInputElement>} event select change event
     */
    const handleTemplateSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const templateIdToSelect: number = parseInt(event.target.value);
        setSelectedTemplate(allUserTemplates.find(template => template.id === templateIdToSelect));

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
                value={selectedTemplate?.name}
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

            <RankingGrid template={selectedTemplate} />
        </div>
        <div></div>
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
