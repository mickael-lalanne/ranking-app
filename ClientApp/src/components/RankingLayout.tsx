import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import AppButton from './shared/AppButton';
import AppTitle from './shared/AppTitle';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { ERankingLayoutMode, RankingLayoutProps, RankingType } from '../models/RankingLayout';
import { getTemplates } from '../services/TemplateServices';
import { useAppDispatch } from '../app/hooks';
import { getTierlists } from '../services/TierlistServices';
import TierlistsViewer from './tierlist/TierlistsViewer';

const RankingLayout = (
    {
        viewerTitle, viewerSubtitle, viewerBtnText,
        builderTitle, builderSubtitle, builderBtnText,
        editorTitle, editorSubtitle, editorBtnText,
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
    const [itemToEdit, setItemToEdit] = useState<RankingType>();

    const dispatch = useAppDispatch();

    // Called when the component is initialized
    useEffect(() => {
        // Get all user templates from the database
        const fetchTemplates: () => Promise<void> = async () => await getTemplates(dispatch);
        fetchTemplates()
            .catch(err => {
                // TODO: handle errors
            });
    }, []);

    // Called when the user come to the Tierlists page
    useEffect(() => {
        if (ViewerComponent && ViewerComponent.name === TierlistsViewer.name) {
            // Get all user tierlists from the database
            const fetchTierlists: () => Promise<void> = async () => await getTierlists(dispatch);
            fetchTierlists()
                .catch(err => {
                    // TODO: handle errors
                });
            }
    }, [ViewerComponent]);

    const theme = useTheme();

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
        setItemToEdit(itemToEdit)
        _switchMode(ERankingLayoutMode.Editor);
    };

    /**
     * Used in the Template Editor when a template needs to be created or updated
     * @param {Template} newItem template to create or update depending on the mode
     */
    const saveHandler = async (newItem: RankingType): Promise<void> => {
        // Todo: show a loading indicator while the server is updating

        if (rankingLayoutMode === ERankingLayoutMode.Builder) {
            await createFunction(newItem, dispatch);
        }

        if (rankingLayoutMode === ERankingLayoutMode.Editor) {
            await updateFunction(newItem, dispatch);
        }

        _switchMode(ERankingLayoutMode.Viewer);
    };

    /**
     * Called when the delete button has been clicked
     * Call the server to delete the template or the tierlist in the database
     */
    const onDeleteItemButtonClick = async (): Promise<void> => {
        // Todo : show a loading indicator while the item is deleting
        if (itemToEdit && itemToEdit.id) {
            await deleteFunction(itemToEdit.id, dispatch)
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
        // Todo : display a confirmation popup when the delete button has been clicked
        if (rankingLayoutMode === ERankingLayoutMode.Editor) {
            return (
                <Button onClick={onDeleteItemButtonClick} className={delete_btn_style}>
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
            {DeleteItemButton()}
            <AppButton
                text={headerButtonText}
                onClickHandler={onHeaderButtonClick}
                color={headerButtonColor}
            />
        </div>

        {showRightMode()}
    </>);
};

export default RankingLayout;

/**
 * CSS STYLES
 */
const viewer_header_style = css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
});

const delete_btn_style = css({
    minWidth: '50px !important',
    height: '50px',
    margin: '0 15px !important'
});
