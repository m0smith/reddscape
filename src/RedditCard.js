import React, { useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';


import { Close } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Link } from 'react-router-dom';
import { CardActionArea, Dialog, Box, CardMedia } from '@mui/material';
import stringify from 'json-stable-stringify'
import ArbitraryCodeCardContent from './ArbitraryCodeCardContent';
import CardModal from './CardModal';



export default function RedditCard({ post }) {
    const { subreddit, author, selftext, selftext_html, created_utc, is_video, preview, thumbnail, title, removed_by_category, is_gallery } = post
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        console.log("open")
        setOpen(true);
    }
    const handleClose = () => {
        console.log("close")
        setOpen(false);
    }

    const isVideo = is_video || preview?.reddit_video_preview
    //console.log(post.thumbnail, post.is_video)
    let thumbnailggg = thumbnail.startsWith('http') ? thumbnail : null
    let fullImageUrl = null


    const content = selftext_html ? decode(selftext_html) : selftext

    const formatDate = (unixTimestamp) => {
        const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const imageContent = ({ thumbnail, thumbnail_height, title, is_self }) => {
        if (is_self) return null

        return (<CardMedia
            onClick={handleOpen}
            component="img"
            // width={thumbnail_width}
            height={thumbnail_height}
            image={decode(thumbnail)}
            alt={title}
            sx={{ objectFit: "contain" }} />)
    }
    function decode(str) {

        let txt = new DOMParser().parseFromString(str, "text/html");

        return txt.documentElement.textContent;

    }

    if (removed_by_category) {
        thumbnailggg = null
        fullImageUrl = null
    } // else if (isVideo) {
    //     [thumbnailggg, fullImageUrl] = default_video(post)
    // } else if (post.is_reddit_media_domain) {
    //     [thumbnailggg, fullImageUrl] = gif_image(post)
    // } else if (post.preview) {
    //     [thumbnailggg, fullImageUrl] = default_image(post)
    // } else if (post.is_gallery) {
    //     [thumbnailggg, fullImageUrl] = default_gallery(post)
    // }


    // let thumbnail = post.thumbnail.startsWith('http') ? post.thumbnail : null

    // if (!thumbnail && post.preview) {
    //     thumbnail = decodeURI(post.preview.images[0].resolutions[0].url)
    // }
    // if (!thumbnail && post.url_overridden_by_dest) {
    //     thumbnail = post.url_overridden_by_dest
    // }
    const ordered_json = (o) => {
        return stringify(o, { space: 2 })
    }
    const formatted_post = ("<pre>" + ordered_json(post) + "</pre>")
    const imagepart = imageContent(post)
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
        <Box style={boxStyle}>
            <Card>
                <CardContent>
                    {post.is_nsfw && <span style={{ color: 'red' }}>NSFW </span>}
                    {post.is_spoiler && <span style={{ color: 'orange' }}>Spoiler </span>}
                    {post.is_stickied && <span style={{ color: 'green' }}>Sticky </span>}
                    {is_gallery && <span style={{ color: 'pink' }}>Gallery </span>}
                    <Link to={`/r/${subreddit}`}>/r/{subreddit}</Link>
                    {' | '}
                    <Link to={`/user/${author}`}> u/{author} </Link>
                    <p style={{ margin: '0px 0px 0px 1em', fontStyle: 'italic' }}>{formatDate(created_utc)}</p>
                </CardContent>
                <CardContent><Typography>{title}</Typography></CardContent>
                {imagepart && imagepart}

                {content && content.length > 0 && <ArbitraryCodeCardContent code={content} />}
                <ArbitraryCodeCardContent code={formatted_post} />
                {imagepart && (<CardModal post={post} handleClose={handleClose} open={open} />)}
            </Card>

        </Box>
    )

    // return <RedditCard
    //     key={post.id}
    //     id={post.id}
    //     title={post.title}
    //     author={post.author}
    //     url={post.url}
    //     domain={post.domain}
    //     selftext={selftext}
    //     thumbnail={thumbnail}
    //     fullImageUrl={fullImageUrl}
    //     numComments={post.num_comments}
    //     permalink={post.permalink}
    //     subreddit={post.subreddit}
    //     isNSFW={post.over_18}
    //     created_utc={post.created_utc}
    //     isSpoiler={post.spoiler}
    //     isStickied={post.stickied}
    //     isVideo={isVideo}
    //     crosspostParent={post.crosspost_parent_list ? post.crosspost_parent_list[0] : null}
    // />
}