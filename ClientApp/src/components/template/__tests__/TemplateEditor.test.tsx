
import * as React from 'react';
import TemplateEditor from '../TemplateEditor';
import { ERankingLayoutMode } from '../../../models/RankingLayout';
import { renderWithProviders } from '../../../utils/test-utils';

const TEMPLATE_EDITOR_SAMPLE = <TemplateEditor
    saveHandler={ jest.fn()}
    mode={ERankingLayoutMode.Editor}
/>;

describe('Screenshot', () => {
    it('Takes default screenshot', () => {
        const component = renderWithProviders(TEMPLATE_EDITOR_SAMPLE);
    
        expect(component.baseElement).toMatchSnapshot();
    });
});

describe('Common', () => {

    it('Creates a tier', () => {
        // TODO
    });

    it('Creates an element', () => {
        // TODO
    });
    
});

describe('Builder', () => {

});

describe('Editor', () => {

});
