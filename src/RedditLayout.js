import React from 'react';

const RedditLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {children}
        </div>
    );
};

export default RedditLayout;
