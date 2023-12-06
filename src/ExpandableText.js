import React, { useState } from 'react';

const ExpandableText = ({ text }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const snipett_length = 50

    return (
        <div>
            {isExpanded || text.length < snipett_length ? text : `${text.substring(0, snipett_length)}...`}
            {text.length >= snipett_length && (
                <button onClick={toggleExpanded}>
                    {isExpanded ? 'Show Less' : 'Show More'}
                </button>
            )}
        </div>
    );
};

export default ExpandableText;
