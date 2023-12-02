import { Counter } from './components/Counter';
import { Home } from './components/Home';
import RankingLayout from './components/RankingLayout';
import { TEMPLATE_LAYOUT_PROPS, TIERLIST_LAYOUT_PROPS } from './models/RankingLayout';

const AppRoutes = [
    {
        index: true,
        element: <Home />,
    },
    {
        path: '/counter',
        element: <Counter />,
    },
    {
        path: '/templates',
        element: <RankingLayout {...TEMPLATE_LAYOUT_PROPS} />,
    },
    {
        path: '/tierlists',
        element: <RankingLayout {...TIERLIST_LAYOUT_PROPS} />,
    }
];

export default AppRoutes;
