import { Box } from '@mui/material';
import React from 'react';

const RedditLayout = ({ children }) => {
    return (
        <Box style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: "0px" }}>
            {children}
        </Box>
    );
};

export default RedditLayout;
