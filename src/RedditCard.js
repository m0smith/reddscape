import React, { useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function RedditCard({ title, selftext, domain, isVideo, url, thumbnail, author, numComments, permalink, subreddit, id, created_utc, isNSFW, isSpoiler, isStickied, crosspostParent, fullImageUrl }) {
    const [expanded, setExpanded] = React.useState(false);
    const [expandedComments, setExpandedComments] = React.useState(false);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [isImageModalOpen, setImageModalOpen] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

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

    const snippet_length = isSpoiler ? 1 : 50
    const snippet = selftext.length < snippet_length ? selftext : selftext.substring(0, snippet_length)
    const expanded_text = selftext.length < snippet_length ? null : selftext.substring(snippet_length)

    const formatDate = (unixTimestamp) => {
        const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardContent>

                {isNSFW && <span style={{ color: 'red' }}>NSFW </span>}
                {isSpoiler && <span style={{ color: 'orange' }}>Spoiler </span>}
                {isStickied && <span style={{ color: 'green' }}>Sticky </span>}
                <Link to={`/r/${subreddit}`}>/r/{subreddit}</Link>
                {' | '}
                <Link to={`/user/${author}`}> u/{author} </Link>
                <p style={{ margin: '0px 0px 0px 1em', fontStyle: 'italic' }}>{formatDate(created_utc)}</p>
            </CardContent>
            {thumbnail &&
                <CardMedia
                    component="img"
                    height="194"
                    image={thumbnail}
                    alt={title}
                />}
            {selftext &&
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {snippet}
                    </Typography>
                </CardContent>
            }
            {expanded_text &&
                <CardActions disableSpacing>
                    {numComments > 0 && 
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        Comments
                    </ExpandMore>}
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>{expanded_text}</Typography>
                </CardContent>
            </Collapse>
            <Collapse in={expandedComments} timeout="auto" unmountOnExit>
                {comments.map(comment => (
                <CardContent>
                    <Typography paragraph>{comment.body}</Typography>
                </CardContent>))}
            </Collapse>
        </Card>
    );
}