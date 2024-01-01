import * as React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import { screen } from '@testing-library/react';
import AppTitle from '../AppTitle';

const title: string = 'My title';
const subtitle: string = 'My subtitle';

const AppTitleTest = () => {
    return <AppTitle title={title} subtitle={subtitle} />;
};

describe('Screenshot', () => {
    it('takes default screenshot', () => {
        const component = renderWithProviders(AppTitleTest());

        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Common', () => {
    it('checks the title and subtitle are displayed', () => {
        renderWithProviders(AppTitleTest());

        expect(screen.getByText(title)).toBeDefined();
        expect(screen.getByText(subtitle)).toBeDefined();
    });
});
