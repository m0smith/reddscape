import React, { useState } from 'react';
import axios from 'axios';
import Comment from './Comment';
import ImageModal from './ImageModal';
import { Link } from 'react-router-dom';


const RedditBox = ({ title, selftext, url, thumbnail, author, numComments, permalink, subreddit, id, created_utc, isNSFW, isSpoiler, isStickied, crosspostParent, fullImageUrl }) => {
    const redditBaseUrl = 'https://www.reddit.com';
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [isImageModalOpen, setImageModalOpen] = useState(false);

    const nesting = 1
    const loadComments = () => {
        if (!showComments) {
            axios.get(`https://www.reddit.com/r/${subreddit}/comments/${id}.json`)
                .then(response => {
                    const commentsData = response.data[1].data.children.map(child => child.data);
                    setComments(commentsData);
                })
                .catch(error => console.error('Error fetching comments:', error));
        }
        setShowComments(!showComments);
    };
    const formatDate = (unixTimestamp) => {
        const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const toggleImageModal = () => {
        setImageModalOpen(!isImageModalOpen);
    };
    // Responsive style for the RedditBox
    const boxStyle = {
        border: '1px solid gray',
        padding: '10px',
        margin: '10px',
        width: '100%', // Full width on smaller screens
        maxWidth: '300px', // Fixed max width on larger screens
        overflow: 'hidden'
    };

    return (
        <div style={boxStyle}>

            <div>
                <Link to={`/r/${subreddit}`}>/r/{subreddit}</Link>
                {' | '}
                <Link to={`/user/${author}`}> u/{author} </Link>

            </div>
            {crosspostParent && (
                <div style={{ marginTop: '10px' }}>
                    <strong>Crossposted from:</strong>
                    <a href={`https://www.reddit.com/r/${crosspostParent.subreddit}`} target="_blank" rel="noopener noreferrer">
                        /r/{crosspostParent.subreddit}
                    </a>
                    {' by '}
                    <a href={`https://www.reddit.com/user/${crosspostParent.author}`} target="_blank" rel="noopener noreferrer">
                        u/{crosspostParent.author}
                    </a>
                </div>
            )}

            <h4>{title}</h4>
            <div>Posted on: {formatDate(created_utc)}</div>
            <div style={{ marginBottom: '10px' }}>
                {isNSFW && <span style={{ color: 'red' }}>NSFW </span>}
                {isSpoiler && <span style={{ color: 'orange' }}>Spoiler </span>}
                {isStickied && <span style={{ color: 'green' }}>Stickied </span>}
            </div>
            {thumbnail && thumbnail !== 'self' && <img
                src={thumbnail}
                alt={title}
                style={{ maxWidth: '100%', cursor: 'pointer' }}
                onClick={toggleImageModal}
            />}
            {isImageModalOpen && (
                <ImageModal src={fullImageUrl || thumbnail} alt={title} onClose={() => setImageModalOpen(false)} />
            )}
            <div>
                {selftext && (<p>{selftext}</p>)}
            </div>
            <div>
                <a href={url} target="_blank" rel="noopener noreferrer">Read more</a>
            </div>
            <div>
                {numComments} comments -
                <a href={`${redditBaseUrl}${permalink}`} target="_blank" rel="noopener noreferrer">See on Redit</a>

            </div>
            <div>
                <button onClick={loadComments}>{showComments ? 'Hide' : 'Show'} Comments</button>
                {showComments && comments.map(comment => (
                    <Comment nesting={nesting} key={comment.id} body={comment.body} created_utc={comment.created_utc} replies={comment.replies ? comment.replies : []} />
                ))}

            </div>
        </div>
    );
};
// comment.replies.data.children.map(child => child.data)

export default RedditBox;
