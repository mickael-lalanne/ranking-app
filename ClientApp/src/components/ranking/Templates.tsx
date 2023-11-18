import React from 'react';
import TemplatesViewer from './TemplatesViewer';
import TemplateBuilder from './TemplateBuilder';

const Templates = () => {
    return(<>
        <div>Templates list :</div>
        <TemplatesViewer />

        <TemplateBuilder />
    </>);
};

export default Templates;
