import React, { useEffect } from 'react';

const Templates = () => {

    useEffect(() => {
        console.log('#useEffect#');

        const fetchTemplates = async () => {
            const templates = await fetch('template');
            console.log(templates);
            console.log(await templates.json());
        };
        fetchTemplates();
    });

    return(
        <div>Bonjour</div>
    );
};

export default Templates;
