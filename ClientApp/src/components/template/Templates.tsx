import React, { useState } from 'react';
import TemplatesViewer from './TemplatesViewer';
import TemplateEditor from './TemplateEditor';
import { css } from '@emotion/css';
import AppButton from '../shared/AppButton';
import AppTitle from '../shared/AppTitle';
import { ETemplateMode, Template } from '../../models/Template';
import { createTemplate, deleteTemplate, updateTemplate } from '../../services/TemplateServices';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const VIEWER_TITLE = 'My templates';
const VIEWER_SUBTITLE = 'Create, Edit or Delete';
const VIEWER_BTN_TEXT = 'Add template';

const BUILDER_TITLE = 'Template creation';
const BUILDER_SUBTITLE = 'Add a name, tiers and elements';
const BUILDER_BTN_TEXT = 'Cancel';

const EDITOR_TITLE = 'Template edition';
const EDITOR_SUBTITLE = 'Update your template here';
const EDITOR_BTN_TEXT = 'Cancel';

const Templates = () => {
    const [templateMode, setTemplateMode] = useState<ETemplateMode>(ETemplateMode.Viewer);
    const [headerTitle, setHeaderTitle] = useState<string>(VIEWER_TITLE);
    const [headerSubtitle, setHeaderSubtitle] = useState<string>(VIEWER_SUBTITLE);
    const [headerButtonText, setHeaderButtonText] = useState<string>(VIEWER_BTN_TEXT);
    const [headerButtonColor, setHeaderButtonColor] = useState<string>();
    const [templateToEdit, setTemplateToEdit] = useState<Template>();

    const theme = useTheme();

    /**
     * Change the mode and the header texts depending on the mode parameter
     * @param {ETemplateMode} mode the new mode to display
     */
    const _switchMode = (mode: ETemplateMode) => {
        switch (mode) {
            case ETemplateMode.Builder:
                setHeaderTitle(BUILDER_TITLE);
                setHeaderSubtitle(BUILDER_SUBTITLE);
                setHeaderButtonText(BUILDER_BTN_TEXT);
                setHeaderButtonColor('white');
                break;

            case ETemplateMode.Editor:
                setHeaderTitle(EDITOR_TITLE);
                setHeaderSubtitle(EDITOR_SUBTITLE);
                setHeaderButtonText(EDITOR_BTN_TEXT);
                setHeaderButtonColor('white');
                break;
        
            case ETemplateMode.Viewer:
                setHeaderTitle(VIEWER_TITLE);
                setHeaderSubtitle(VIEWER_SUBTITLE);
                setHeaderButtonText(VIEWER_BTN_TEXT);
                setHeaderButtonColor(theme.defaultRankingTheme.primary);
                break;
        }
        setTemplateMode(mode);
    }

    /**
     * Called when the header button has been clicked
     * Change the template mode
     */
    const onHeaderButtonClick = (): void => {
        switch (templateMode) {
            case ETemplateMode.Viewer:
                _switchMode(ETemplateMode.Builder);
                break;
        
            case ETemplateMode.Builder:
            case ETemplateMode.Editor:
                _switchMode(ETemplateMode.Viewer);
                break;
        }
    };

    /**
     * Used in the Template Viewer when a template preview has been clicked
     * Show the Editor view to update the template
     * @param {Template} template the template to edit
     */
    const editHandler = (template: Template): void => {
        setTemplateToEdit(template)
        _switchMode(ETemplateMode.Editor);
    };

    /**
     * Used in the Template Editor when a template needs to be created or updated
     * @param {Template} newTemplate template to create or update depending on the mode
     */
    const saveHandler = async (newTemplate: Template): Promise<void> => {
        // Todo: show a loading indicator while the server is updating

        if (templateMode === ETemplateMode.Builder) {
            await createTemplate(newTemplate);
        }

        if (templateMode === ETemplateMode.Editor) {
            await updateTemplate(newTemplate);
        }

        _switchMode(ETemplateMode.Viewer);
    };

    /**
     * Called when the delete template button has been clicked
     * Call the server to delete the template in the database
     */
    const onDeleteTemplateButtonClick = async (): Promise<void> => {
        // Todo : show a loading indicator while the template is deleting
        if (templateToEdit && templateToEdit.id) {
            await deleteTemplate(templateToEdit.id)
        }
        _switchMode(ETemplateMode.Viewer);
    };

    /**
     * Show Viewer or Builder depending on the current mode
     * @returns {JSX.Element} the Viewer or the Builder React component
     */
    const showRightMode = (): JSX.Element => {
        switch (templateMode) {
            case ETemplateMode.Builder:
            case ETemplateMode.Editor:
                return <TemplateEditor saveHandler={saveHandler} mode={templateMode} template={templateToEdit} />

            case ETemplateMode.Viewer:
            default:
                return <TemplatesViewer editHandler={editHandler} />
        }
    };

    /**
     * @returns {JSX.Element} a delete template button only if we are in edit mode
     */
    const DeleteTemplateButton = (): JSX.Element => {
        // Todo : display a confirmation popup when the delete button has been clicked
        if (templateMode === ETemplateMode.Editor) {
            return (
                <Button onClick={onDeleteTemplateButtonClick} className={delete_template_btn_style}>
                    <DeleteForeverIcon style={{ height: '32px', width: '32px' }} />
                </Button>
            );
        }
        return <></>;
    };

    return(<>
        <div className={viewer_header_style}>
            <AppTitle title={headerTitle} subtitle={headerSubtitle} />
            <div className="app_spacer"></div>
            {DeleteTemplateButton()}
            <AppButton
                text={headerButtonText}
                onClickHandler={onHeaderButtonClick}
                color={headerButtonColor}
            />
        </div>

        {showRightMode()}
    </>);
};

export default Templates;

/**
 * CSS STYLES
 */
const viewer_header_style = css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
});

const delete_template_btn_style = css({
    minWidth: '50px !important',
    height: '50px',
    margin: '0 15px !important'
});