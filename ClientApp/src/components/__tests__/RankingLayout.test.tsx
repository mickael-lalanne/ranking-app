import * as React from 'react';
import RankingLayout from '../RankingLayout';
import { renderWithProviders } from '../../utils/test-utils';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import {
    RankingLayoutProps,
    TEMPLATE_LAYOUT_PROPS,
    TIERLIST_LAYOUT_PROPS,
} from '../../models/RankingLayout';
import { act } from 'react-dom/test-utils';

// Mock the server calls from the template service when saving a template
const templateServicePath = '../../services/TemplateServices';
jest.mock(templateServicePath, () => ({
    ...jest.requireActual(templateServicePath),
    getTemplates: () =>
        new Promise<[]>((resolve) => {
            resolve([]);
        }),
}));
const tierlistServicePath = '../../services/TierlistServices';
jest.mock(tierlistServicePath, () => ({
    ...jest.requireActual(tierlistServicePath),
    getTierlists: () =>
        new Promise<[]>((resolve) => {
            resolve([]);
        }),
}));

const RankingLayoutTest = (props: RankingLayoutProps) => {
    return (
        <MemoryRouter>
            <RankingLayout
                viewerTitle={props.viewerTitle}
                viewerSubtitle={props.viewerSubtitle}
                viewerBtnText={props.viewerBtnText}
                builderTitle={props.builderTitle}
                builderSubtitle={props.builderSubtitle}
                builderBtnText={props.builderBtnText}
                editorTitle={props.editorTitle}
                editorSubtitle={props.editorSubtitle}
                editorBtnText={props.editorBtnText}
                type={props.type}
                ViewerComponent={props.ViewerComponent}
                EditorComponent={props.EditorComponent}
                createFunction={props.createFunction}
                updateFunction={props.updateFunction}
                deleteFunction={props.deleteFunction}
            />
        </MemoryRouter>
    );
};

describe('Screenshot', () => {
    it('takes template screenshot', async () => {
        let component;
        await act(async () => {
            component = renderWithProviders(
                RankingLayoutTest(TEMPLATE_LAYOUT_PROPS)
            );
        });

        expect(component!.baseElement).toMatchSnapshot('template-layout');
    });

    it('takes tierlist screenshot', async () => {
        let component;
        await act(async () => {
            component = renderWithProviders(
                RankingLayoutTest(TIERLIST_LAYOUT_PROPS)
            );
        });

        expect(component!.baseElement).toMatchSnapshot('tierlist-layout');
    });
});

describe('Common', () => {
    it('switchs from viewer to builder mode', async () => {
        await act(async () => {
            renderWithProviders(RankingLayoutTest(TEMPLATE_LAYOUT_PROPS));
        });

        // Click on the header button
        await userEvent.click(
            screen.getByText(TEMPLATE_LAYOUT_PROPS.viewerBtnText)
        );

        // Now, we should be in the editor view
        expect(
            screen.getByText(TEMPLATE_LAYOUT_PROPS.builderBtnText)
        ).toBeDefined();
    });
});
