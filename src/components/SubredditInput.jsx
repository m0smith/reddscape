import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogContentText, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Folder, Person } from '@mui/icons-material';

function SubredditInput({ type, name, newSubreddit }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tempName, setTempName] = useState(name);
    const [tempType, setTempType] = useState(type);

    const handleOpenDialog = () => {
        setDialogOpen(true);
        setTempName(name); // Copy current name to temporary state
        setTempType(type)
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSave = () => {
        setDialogOpen(false);
        newSubreddit(tempType, tempName); // Update the actual name

    };



    return (
        <div>
            <Button variant="outlined"
                style={{ textTransform: 'none' }}
                onClick={handleOpenDialog}
                startIcon={type === "r" ? <Folder /> : <Person />}>
                {name}
            </Button>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogContent>
                    <FormControl size="small">
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select value={tempType} label="Type" onChange={(e) => setTempType(e.target.value)}>
                            <MenuItem value="r">r</MenuItem>
                            <MenuItem value="user">user</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        autoFocus
                        fullWidth
                        readOnly
                        label="Name"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        size="small"
                    />
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default SubredditInput;
