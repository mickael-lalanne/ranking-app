import { Template } from './Template';
import { Tierlist } from './Tierlist';
import TemplatesViewer from '../components/template/TemplatesViewer';
import TemplateEditor from '../components/template/TemplateEditor';
import { createTemplate, deleteTemplate, updateTemplate } from '../services/TemplateServices';
import TierlistsViewer from '../components/tierlist/TierlistsViewer';
import TierlistsEditor from '../components/tierlist/TierlistsEditor';
import { AppDispatch } from '../app/store';
import { createTierlist, deleteTierlist, updateTierlist } from '../services/TierlistServices';

export type RankingType = Template | Tierlist;

export enum ERankingLayoutMode {
    Viewer = 'viewer',
    Builder = 'builder',
    Editor = 'editor'
};

export enum ERankingLayoutType {
    Template = 'template',
    Tierlist = 'tierlist'
};

type EditorComponent = ({ saveHandler, itemToEdit, mode }: EditorComponentProps) => React.JSX.Element;
type ViewerComponent = ({ editHandler }: ViewerComponentProps) => React.JSX.Element;

export interface EditorComponentProps {
    saveHandler: (itemToSave: RankingType) => Promise<void>;
    itemToEdit?: RankingType | undefined;
    mode: ERankingLayoutMode;
};

export interface ViewerComponentProps {
    editHandler: (itemToEdit: RankingType) => void;
};

export interface RankingLayoutProps {
    viewerTitle: string;
    viewerSubtitle: string;
    viewerBtnText: string;
    builderTitle: string;
    builderSubtitle: string;
    builderBtnText: string;
    editorTitle: string;
    editorSubtitle: string;
    editorBtnText: string;
    type: ERankingLayoutType;
    ViewerComponent: ViewerComponent;
    EditorComponent: EditorComponent;
    createFunction: (itemToCreate: RankingType, dispatch: AppDispatch) => Promise<any>;
    updateFunction: (itemToUpdate: RankingType, dispatch: AppDispatch) => Promise<any>;
    deleteFunction: (itemToDelete: RankingType, dispatch: AppDispatch) => Promise<any>;
}

export const TEMPLATE_LAYOUT_PROPS: RankingLayoutProps = {
    viewerTitle: 'My templates',
    viewerSubtitle: 'Create, Edit or Delete',
    viewerBtnText: 'Add template',
    builderTitle: 'Template creation',
    builderSubtitle: 'Add a name, tiers and elements',
    builderBtnText: 'Cancel',
    editorTitle: 'Template edition',
    editorSubtitle: 'Update your template here',
    editorBtnText: 'Cancel',
    type: ERankingLayoutType.Template,
    ViewerComponent: TemplatesViewer,
    EditorComponent: TemplateEditor,
    createFunction: createTemplate as (templateToCreate: RankingType, dispatch: AppDispatch) => Promise<Template>,
    updateFunction: updateTemplate as (templateToUpdate: RankingType, dispatch: AppDispatch) => Promise<void>,
    deleteFunction: deleteTemplate as (templateToDelete: RankingType, dispatch: AppDispatch) => Promise<void>
};

export const TIERLIST_LAYOUT_PROPS: RankingLayoutProps = {
    viewerTitle: 'My tierlists',
    viewerSubtitle: 'Create, Edit or Delete',
    viewerBtnText: 'Add tierlist',
    builderTitle: 'Tierlist creation',
    builderSubtitle: 'Rank your elements',
    builderBtnText: 'Cancel',
    editorTitle: 'Tierlist edition',
    editorSubtitle: 'Update your tierlist here',
    editorBtnText: 'Cancel',
    type: ERankingLayoutType.Tierlist,
    ViewerComponent: TierlistsViewer,
    EditorComponent: TierlistsEditor,
    createFunction: createTierlist as (tierlistToCreate: RankingType) => Promise<Tierlist>,
    updateFunction: updateTierlist as (tierlistToUpdate: RankingType) => Promise<void>,
    deleteFunction: deleteTierlist as (tierlistToDelete: RankingType) => Promise<void>
};

export const DELETE_CONFIRM_TEMPLATE_TITLE: string = '⚠️ Are you sure you want to delete this template?';
export const DELETE_CONFIRM_TIERLIST_TITLE: string = '⚠️ Are you sure you want to delete this tierlist?';

export const DELETE_CONFIRM_TEMPLATE_CONTENT: string = `Removing this template will also delete all his tierlists.\n
If you're sure you want to continue, please write the template name bellow.`;