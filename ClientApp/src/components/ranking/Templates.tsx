import React, { useState } from 'react';
import TemplatesViewer from './TemplatesViewer';
import TemplateBuilder from './TemplateBuilder';
import { css } from '@emotion/css';
import AddButton from '../shared/AddButton';
import AppTitle from '../shared/AppTitle';
import { Template } from '../../models/Template';
import { createTemplate } from '../../services/TemplateServices';

enum ETemplateMode {
    Viewer = 'viewer',
    Builder = 'builder'
};

const VIEWER_TITLE = 'My templates';
const VIEWER_SUBTITLE = 'Create, Edit or Delete';
const BUILDER_TITLE = 'Template creation';
const BUILDER_SUBTITLE = 'Add a name, tiers and elements';

const VIEWER_BTN_TEXT = 'Add template';
const BUILDER_BTN_TEXT = 'Cancel';

const Templates = () => {
    const [templateMode, setTemplateMode] = useState<ETemplateMode>(ETemplateMode.Viewer);
    const [headerTitle, setHeaderTitle] = useState<string>(VIEWER_TITLE);
    const [headerSubtitle, setHeaderSubtitle] = useState<string>(VIEWER_SUBTITLE);
    const [headerButtonText, setHeaderButtonText] = useState<string>(VIEWER_BTN_TEXT);

    /**
     * Change the mode and the header texts depending on the mode parameter
     * @param {ETemplateMode} mode the new mode to display
     */
    const _switchMode = (mode: ETemplateMode) => {
        switch (mode) {
            case ETemplateMode.Builder:
                setTemplateMode(ETemplateMode.Builder);
                setHeaderTitle(BUILDER_TITLE);
                setHeaderSubtitle(BUILDER_SUBTITLE);
                setHeaderButtonText(BUILDER_BTN_TEXT);
                break;
        
            case ETemplateMode.Viewer:
                setTemplateMode(ETemplateMode.Viewer);
                setHeaderTitle(VIEWER_TITLE);
                setHeaderSubtitle(VIEWER_SUBTITLE);
                setHeaderButtonText(VIEWER_BTN_TEXT);
                break;
        }
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
                _switchMode(ETemplateMode.Viewer);
                break;
        }
    };

    const creationHandler = async (newTemplate: Template): Promise<void> => {
        await createTemplate(newTemplate);
        _switchMode(ETemplateMode.Viewer);
    };

    /**
     * Show Viewer or Builder depending on the current mode
     * @returns {JSX.Element} the Viewer or the Builder React component
     */
    const showRightMode = (): JSX.Element => {
        switch (templateMode) {
            case ETemplateMode.Builder:
                return <TemplateBuilder creationHandler={creationHandler} />

            case ETemplateMode.Viewer:
            default:
                return <TemplatesViewer />
        }
    };

    return(<>
        <div className={viewer_header_style}>
            <AppTitle title={headerTitle} subtitle={headerSubtitle} />
            <AddButton text={headerButtonText} onClickHandler={onHeaderButtonClick}/>
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
