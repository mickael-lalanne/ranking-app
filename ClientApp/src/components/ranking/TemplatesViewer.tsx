import React, { useEffect, useState } from 'react';
import { Template } from '../../models/Template';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteTemplate, getTemplates } from '../../services/TemplateServices';

const TemplatesViewer = () => {
    const [userTemplates, setUserTemplates] = useState<Template[]>([]);

    // Called when the component is initialized
    useEffect(() => {
        // Get all user templates from the database
        const fetchTemplates: () => Promise<void> = async () => {
            setUserTemplates(await getTemplates());
        };
        fetchTemplates()
            .catch(err => {
                // TODO: handle errors
            });
    }, []);

    /**
     * Called when the user clicked on the "Delete" button
     * Delete the template (both client and server side) 
     */
    const onDeleteClick = async (templateId: number): Promise<void> => {
        await deleteTemplate(templateId);
        setUserTemplates(userTemplates.filter(t => t.id !== templateId));
    };

    const generateTemplatesListItems = (): JSX.Element[] => {
        const litsItems: JSX.Element[] = [];

        userTemplates.forEach(template => {
            litsItems.push(
                <ListItem>
                    <ListItemButton>
                        <ListItemText primary={template.name} />
                        <IconButton edge="end" aria-label="delete" onClick={() => onDeleteClick(template.id!)}>
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
