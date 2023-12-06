import React from 'react';

const Comment = ({ body, data , nesting, created_utc }) => {
    const replies = data && data.replies
    const formatDate = (unixTimestamp) => {
        const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };
    
    return (
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
            
            <p>{nesting} {body}</p>
            <div>Commented on: {formatDate(created_utc)}</div>
            
            
            {replies && replies.map(reply => (
                <Comment nesting={nesting+1} key={reply.id} body={reply.body} created_utc={reply.created_utc} replies={reply.replies} />
            ))}
        </div>
    );
};

export default Comment;
