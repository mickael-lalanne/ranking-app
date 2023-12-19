import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import AppButton from './shared/AppButton';
import AppTitle from './shared/AppTitle';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DELETE_CONFIRM_TEMPLATE_CONTENT, DELETE_CONFIRM_TEMPLATE_TITLE, DELETE_CONFIRM_TIERLIST_TITLE, ERankingLayoutMode, ERankingLayoutType, RankingLayoutProps, RankingType } from '../models/RankingLayout';
import { getTemplates } from '../services/TemplateServices';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getTierlists } from '../services/TierlistServices';
import { useLocation } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import { updateLoading, updateUser } from '../store/ApplicationStore';
import ConfirmDialog from './shared/ConfirmDialog';
import { Template } from '../models/Template';

const RankingLayout = (
    {
        viewerTitle, viewerSubtitle, viewerBtnText,
        builderTitle, builderSubtitle, builderBtnText,
        editorTitle, editorSubtitle, editorBtnText,
        type,
        ViewerComponent,
        EditorComponent,
        createFunction,
        updateFunction,
        deleteFunction
    } : RankingLayoutProps
) => {
    const [rankingLayoutMode, setRankingLayoutMode] = useState<ERankingLayoutMode>(ERankingLayoutMode.Viewer);
    const [headerTitle, setHeaderTitle] = useState<string>(viewerTitle);
    const [headerSubtitle, setHeaderSubtitle] = useState<string>(viewerSubtitle);
    const [headerButtonText, setHeaderButtonText] = useState<string>(viewerBtnText);
    const [headerButtonColor, setHeaderButtonColor] = useState<string>();
    const [headerButtonDisable, setHeaderButtonDisable] = useState<boolean>(false);
    const [itemToEdit, setItemToEdit] = useState<RankingType>();
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmContent, setConfirmContent] = useState<string>('');

    const dispatch = useAppDispatch();
    const location = useLocation();
    const { userId } = useAuth();

    const templates: Template[] = useAppSelector(state => state.templates.templates);

    // Called when the component is initialized
    useEffect(() => {
        // First, get user info and store it into the store
        dispatch(updateUser({ id: userId}));

        // Then, get all user templates from the database
        const fetchTemplates: () => Promise<void> = async () => await getTemplates(dispatch, userId!);
        fetchTemplates()
            .catch(err => {
                // TODO: handle errors
            });
    }, []);

    // Called when the user come to the Tierlists page
    useEffect(() => {
        if (type === ERankingLayoutType.Tierlist) {
            // Get all user tierlists from the database
            const fetchTierlists: () => Promise<void> = async () => await getTierlists(dispatch);
            fetchTierlists()
                .catch(err => {
                    // TODO: handle errors
                });
        }
    }, [ViewerComponent]);

    // Called when the templates value has changed
    useEffect(() => {
        if (type === ERankingLayoutType.Tierlist) {
            // Dsiable the "Add tierlist" button if there is no templates"
            setHeaderButtonDisable(templates.length === 0);
        } else {
            setHeaderButtonDisable(false);
        }
    }, [templates, type]);

    // Called when the layout mode has changed (for ex: from Viewer to Builder)
    useEffect(() => {
        // Reset the itemToEdit property when leaving the builder / editor mode
        if (rankingLayoutMode === ERankingLayoutMode.Viewer) {
            setItemToEdit(undefined);
        }
    }, [rankingLayoutMode]);

    // Called when the url has changed
    // For example, user goes from Templates page to Tierlists page
    useEffect(() => {
        // Update header and buttons values
       _switchMode(ERankingLayoutMode.Viewer);
    }, [location]);

    const theme = useTheme();
    const loading: boolean = useAppSelector(state => state.application.loading);

    /**
     * Change the mode and the header texts depending on the mode parameter
     * @param {ERankingLayoutMode} mode the new mode to display
     */
    const _switchMode = (mode: ERankingLayoutMode) => {
        switch (mode) {
            case ERankingLayoutMode.Builder:
                setHeaderTitle(builderTitle);
                setHeaderSubtitle(builderSubtitle);
                setHeaderButtonText(builderBtnText);
                setHeaderButtonColor('white');
                break;

            case ERankingLayoutMode.Editor:
                setHeaderTitle(editorTitle);
                setHeaderSubtitle(editorSubtitle);
                setHeaderButtonText(editorBtnText);
                setHeaderButtonColor('white');
                break;
        
            case ERankingLayoutMode.Viewer:
                setHeaderTitle(viewerTitle);
                setHeaderSubtitle(viewerSubtitle);
                setHeaderButtonText(viewerBtnText);
                setHeaderButtonColor(theme.defaultRankingTheme.primary);
                break;
        }
        setRankingLayoutMode(mode);
    }

    /**
     * Called when the header button has been clicked
     * Change the layout mode
     */
    const onHeaderButtonClick = (): void => {
        switch (rankingLayoutMode) {
            case ERankingLayoutMode.Viewer:
                _switchMode(ERankingLayoutMode.Builder);
                break;
        
            case ERankingLayoutMode.Builder:
            case ERankingLayoutMode.Editor:
                _switchMode(ERankingLayoutMode.Viewer);
                break;
        }
    };

    /**
     * Used in the Viewer when a template or tierlist preview has been clicked
     * Show the Editor view to update the item
     * @param {RankingType} itemToEdit the template or tierlist to edit
     */
    const editHandler = (itemToEdit: RankingType): void => {
        setItemToEdit(itemToEdit);
        _switchMode(ERankingLayoutMode.Editor);
    };

    /**
     * Used in the Template Editor when a template needs to be created or updated
     * @param {Template} newItem template to create or update depending on the mode
     */
    const saveHandler = async (newItem: RankingType): Promise<void> => {
        if (rankingLayoutMode === ERankingLayoutMode.Builder) {
            await createFunction(newItem, dispatch);
        }

        if (rankingLayoutMode === ERankingLayoutMode.Editor) {
            await updateFunction(newItem, dispatch);
        }

        _switchMode(ERankingLayoutMode.Viewer);

        // Hide loading indicator
        dispatch(updateLoading(false));
    };

    /**
     * Called when the delete button has been clicked
     * Display a confirmation popup before deleting the item in base
     */
    const onDeleteItemButtonClick = async (): Promise<void> => {
        if (itemToEdit && itemToEdit.id) {
            setConfirmTitle(type === ERankingLayoutType.Template
                ? DELETE_CONFIRM_TEMPLATE_TITLE
                : DELETE_CONFIRM_TIERLIST_TITLE
            );
            setConfirmContent(type === ERankingLayoutType.Template
                ? DELETE_CONFIRM_TEMPLATE_CONTENT
                : ''
            );
            setShowConfirmation(true);
        } else {
            _switchMode(ERankingLayoutMode.Viewer);
        }
    };

    /**
     * Called when the confirm button of the dialog has been clicked
     * Call the server to delete the template or the tierlist in the database
     */
    const deleteConfirmHandler = async (): Promise<void> => {
        if (itemToEdit && itemToEdit.id) {
            // Show loading indicator
            dispatch(updateLoading(true));

            setShowConfirmation(false);

            await deleteFunction(itemToEdit, dispatch);

            // Hide loading indicator
            dispatch(updateLoading(false));
        }
        _switchMode(ERankingLayoutMode.Viewer);
    };

    /**
     * Show Viewer or Builder depending on the current mode
     * @returns {JSX.Element} the Viewer or the Builder React component
     */
    const showRightMode = (): JSX.Element => {
        switch (rankingLayoutMode) {
            case ERankingLayoutMode.Builder:
            case ERankingLayoutMode.Editor:
                return <EditorComponent
                    saveHandler={saveHandler}
                    itemToEdit={itemToEdit}
                    mode={rankingLayoutMode}
                />;

            case ERankingLayoutMode.Viewer:
            default:
                return <ViewerComponent editHandler={editHandler} />
        }
    };

    /**
     * @returns {JSX.Element} a delete button only if we are in edit mode
     */
    const DeleteItemButton = (): JSX.Element => {
        if (rankingLayoutMode === ERankingLayoutMode.Editor) {
            return (
                <Button onClick={onDeleteItemButtonClick} className={delete_btn_style} disabled={loading}>
                    <DeleteForeverIcon style={{ height: '32px', width: '32px' }} />
                </Button>
            );
        }
        return <></>;
    };

    return(<>
        <div className={header_style}>
            <AppTitle title={headerTitle} subtitle={headerSubtitle} />
            <div className="app_spacer"></div>
            {DeleteItemButton()}
            <AppButton
                text={headerButtonText}
                onClickHandler={onHeaderButtonClick}
                color={headerButtonColor}
                disabled={loading || headerButtonDisable}
            />
        </div>

        {showRightMode()}

        <ConfirmDialog
            open={showConfirmation}
            title={confirmTitle}
            content={confirmContent}
            confirmHandler={deleteConfirmHandler}
            cancelHandler={() => setShowConfirmation(false)}
            textValidation={type === ERankingLayoutType.Template ? itemToEdit?.name : undefined}
        />
    </>);
};

export default RankingLayout;

/**
 * CSS STYLES
 */
const header_style = css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
});

const delete_btn_style = css({
    minWidth: '50px !important',
    height: '50px',
    margin: '0 15px !important'
});
