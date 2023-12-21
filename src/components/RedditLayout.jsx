import { Box } from '@mui/material';
import React from 'react';
import './RedditLayout.css'

const RedditLayout = ({ children }) => {
    return (
        <Box className="main-content" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: "0px" }}>
            {children}
        </Box>
    );
};

export default RedditLayout;
