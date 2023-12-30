import * as React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import { screen } from '@testing-library/react';
import InfoBox from '../InfoBox';

const content: string = 'My content';

const InfoBoxTest = () => {
    return <InfoBox content={content} />;
};

describe('Screenshot', () => {
    it('Takes default screenshot', () => {
        const component = renderWithProviders(InfoBoxTest());

        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Common', () => {
    it('checks the content text is displayed', () => {
        renderWithProviders(InfoBoxTest());

        expect(screen.getByText(content)).toBeDefined();
    });
});
