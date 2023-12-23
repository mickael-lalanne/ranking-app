import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

const ConfirmDialog = ({
    title,
    open,
    cancelHandler,
    confirmHandler,
    content,
    textValidation,
}: {
    title: string;
    content: string;
    open: boolean;
    cancelHandler: () => void;
    confirmHandler: () => void;
    textValidation?: string;
}) => {
    const [disableConfirmButton, setDisableConfirmButton] = useState<boolean>(!!textValidation);

    // Reset disable state when open and textValidation props changed
    useEffect(() => {
        setDisableConfirmButton(!!textValidation);
    }, [textValidation]);

    // Check if the user can click on the Confirm button
    const onTextValidationChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setDisableConfirmButton(event.target.value !== textValidation);
    };

    const ShowTextValidation = (): React.JSX.Element | undefined => {
        if (textValidation) {
            return (
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    placeholder={textValidation}
                    fullWidth
                    variant="standard"
                    onChange={onTextValidationChange}
                />
            );
        }
    };

    return (
        <Dialog open={open} onClose={cancelHandler} style={{ padding: '5px'}}>
            <div className={dialog_container_style}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{content}</DialogContentText>
                    {ShowTextValidation()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelHandler}>Cancel</Button>
                    <Button
                        disabled={disableConfirmButton && !!textValidation}
                        onClick={confirmHandler}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default ConfirmDialog;

/**
 * CSS STYLES
 */
const dialog_container_style = css({
    padding: '7.5px'
});
