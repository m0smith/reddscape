import './SettingsModal.css'
import { Checkbox, Dialog, DialogContent, DialogContentText, FormControlLabel, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material';
import { useState } from 'react';


export default function SettingsModal({ settings, open, handleClose }) {
    const [_settings, _setSettings] = useState(settings)
    const handleNsfw = (e) => {

        _setSettings((old) => {
            const rtnval = { ...old }
            console.log(rtnval)
            rtnval.nsfw = !rtnval.nsfw
            console.log(rtnval)
            return rtnval
        })
    }

    const _handleClose = () => {
        handleClose(_settings)
    }

    const boxStyle = {
        border: '1px solid gray',
        padding: '10px',
        margin: '10px',
        width: '100%', // Full width on smaller screens
        //maxWidth: '200px', // Fixed max width on larger screens
        maxWidth: "xl",
        maxHeight: '90vh',
        overflow: 'auto'
    };
    // console.log("IMGE:" + imageUrl)
    return (<Dialog
        open={open}
        onClose={_handleClose}
        fullWidth
        //maxWidth="100%"
        style={boxStyle}
    >
        <DialogContentText>Settings</DialogContentText>
        <DialogContent>
           

            <FormControlLabel
                control={
                    <Checkbox
                        checked={_settings.nsfw}
                        onChange={handleNsfw}
                        name="nsfwCheckbox"
                    />
                }
                label="Include NSFW"
            />
             <IconButton sx={{ ml: 'auto' }} onClick={_handleClose}>
                <Close />
            </IconButton>
        </DialogContent>

    </Dialog>
    )
}