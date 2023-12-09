import Home from './components/Home';
import RankingLayout from './components/RankingLayout';
import { TEMPLATE_LAYOUT_PROPS, TIERLIST_LAYOUT_PROPS } from './models/RankingLayout';

export enum ERankingAppRoutes {
    templates = '/templates',
    tierlists = '/tierlists',
};

const AppRoutes = [
    {
        index: true,
        element: <Home />,
    },
    {
        path: ERankingAppRoutes.templates,
        element: <RankingLayout {...TEMPLATE_LAYOUT_PROPS} />,
    },
    {
        path: ERankingAppRoutes.tierlists,
        element: <RankingLayout {...TIERLIST_LAYOUT_PROPS} />,
    }
];

export default AppRoutes;
