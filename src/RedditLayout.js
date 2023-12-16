import React from 'react';

const RedditLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: "0px" }}>
            {children}
        </div>
    );
};

export default RedditLayout;
