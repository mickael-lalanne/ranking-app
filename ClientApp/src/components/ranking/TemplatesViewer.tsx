import React, { useEffect, useState } from 'react';
import { Template } from '../../models/Template';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';


const TemplatesViewer = () => {
    const [userTemplates, setUserTemplates] = useState<Template[]>([]);

    // Called when the component is initialized
    useEffect(() => {
        // Get all user templates from the database
        const fetchTemplates: () => Promise<void> = async () => {
            const templatesResponse = await fetch('template');
            setUserTemplates(await templatesResponse.json());
        };
        fetchTemplates()
            .catch(err => {
                // TODO: handle errors
            });
    });

    const generateTemplatesListItems = (): JSX.Element[] => {
        const litsItems: JSX.Element[] = [];

        userTemplates.forEach(template => {
            litsItems.push(
                <ListItem>
                    <ListItemButton>
                        <ListItemText primary={template.name} />
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </ListItemButton>
                </ListItem>
            );
        });

        return litsItems;
    };

    return (<>
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <List>
                {generateTemplatesListItems()}
            </List>
        </Box>
    </>);
};

export default TemplatesViewer;
