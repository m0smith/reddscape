import React, { useState } from 'react';
import axios from 'axios';
import Comment from './Comment';
import ImageModal from './ImageModal';
import { Link } from 'react-router-dom';
import ExpandableText from './ExpandableText';
import CardModal from './CardModal';


const RedditBox = ({ title, selftext, domain, isVideo, url, thumbnail, author, numComments, permalink, subreddit, id, created_utc, isNSFW, isSpoiler, isStickied, crosspostParent, fullImageUrl }) => {
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

    function decode(str) {

        let txt = new DOMParser().parseFromString(str, "text/html");

        return txt.documentElement.textContent;

    }

    return (
        <div style={boxStyle}>

            <div style={{ fontSize: "smaller", margin: '0px' }}>

                {isNSFW && <span style={{ color: 'red' }}>NSFW </span>}
                {isSpoiler && <span style={{ color: 'orange' }}>Spoiler </span>}
                {isStickied && <span style={{ color: 'green' }}>Sticky </span>}

                <Link to={`/r/${subreddit}`}>/r/{subreddit}</Link>
                {' | '}
                <Link to={`/user/${author}`}> u/{author} </Link>
                <p style={{ margin: '0px 0px 0px 1em', fontStyle: 'italic' }}>{formatDate(created_utc)}</p>

            </div>
            {crosspostParent && (
                <div style={{ fontSize: "smaller", margin: '0px 0px 0px 1em' }}>
                    <strong>Crosspost</strong> <Link to={`/r/${crosspostParent.subreddit}`}>/r/{crosspostParent.subreddit}</Link>
                    {' by '}
                    <Link to={`/user/${crosspostParent.author}`}> u/{crosspostParent.author}</Link>
                </div>
            )}

            <h4 style={{ margin: '2px' }}>{decode(title)}</h4>

            {thumbnail && thumbnail !== 'self' && !isVideo && <img
                src={thumbnail}
                alt={title}
                style={{ maxWidth: '100%', cursor: 'pointer' }}
                onClick={toggleImageModal}
            />}
            {thumbnail && thumbnail !== 'self' && isVideo && <img
                src={thumbnail}
                style={{ maxWidth: '100%', cursor: 'pointer' }}
                onClick={toggleImageModal}
            />}
            {isImageModalOpen && (
                <CardModal src={fullImageUrl || thumbnail} isVideo={isVideo} alt={title} onClose={() => setImageModalOpen(false)} />
            )}
            <div>
                <ExpandableText text={selftext} isSpoiler={isSpoiler} />
            </div>
            <div>
                <a href={url} target="_blank" rel="noopener noreferrer">{domain}</a>
            </div>
            <div>
                {numComments} comments -
                <a href={`${redditBaseUrl}${permalink}`} target="_blank" rel="noopener noreferrer">See on Redit</a>

            </div>
            {numComments > 0 && (
                <div>
                    <button onClick={loadComments}>{showComments ? 'Hide' : 'Show'} Comments</button>
                    {showComments && comments.map(comment => (
                        <Comment nesting={nesting} key={comment.id} body={comment.body} created_utc={comment.created_utc} replies={comment.replies ? comment.replies : []} />
                    ))}

                </div>)}
        </div>
    );
};
// comment.replies.data.children.map(child => child.data)

export default RedditBox;
