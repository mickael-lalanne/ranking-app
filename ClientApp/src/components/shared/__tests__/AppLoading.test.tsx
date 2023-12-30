import * as React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import { screen } from '@testing-library/react';
import AppLoading from '../AppLoading';

const loadingText: string = 'My loading indicator';

const AppLoadingTest = () => {
    return <AppLoading text={loadingText} />;
};

describe('Screenshot', () => {
    it('takes default screenshot', () => {
        const component = renderWithProviders(AppLoadingTest());

        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Common', () => {
    it('checks the text is displayed', () => {
        renderWithProviders(AppLoadingTest());

        expect(screen.getByText(loadingText)).toBeDefined();
    });
});
