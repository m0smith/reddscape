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
import { Box, CardMedia } from '@mui/material';
import stringify from 'json-stable-stringify'
import ArbitraryCodeCardContent from './ArbitraryCodeCardContent';
import CardModal from './CardModal';
import { decode, formatDate } from './utils';
import spoiler from './spoiler.png'



export default function RedditCard({ post }) {
    const { url, domain, subreddit, author, crosspost_parent_list, selftext, selftext_html, created_utc, is_video, preview, thumbnail, title, removed_by_category, is_gallery } = post
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



    const imageContent = ({ thumbnail, thumbnail_height, title, is_self, preview }) => {
        if (is_self) return null

        const preview_images = preview?.images
        const preview_images_source_url = preview_images && preview_images.length > 0 && preview_images[0].source?.url

        const image = thumbnail === "spoiler" ? spoiler :
                      thumbnail === "nsfw" ? preview_images_source_url :
                      thumbnail === "image" ? url :
                      thumbnail === "default" ? preview_images_source_url : thumbnail

        return image && (<CardMedia
            onClick={handleOpen}
            component="img"
            // width={thumbnail_width}
            height={thumbnail_height}
            image={decode(image)}
            alt={thumbnail}
            sx={{ objectFit: "contain" }} />)
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
                    <Typography variant="body2">
                        {post.over_18 && <span style={{ color: 'red' }}>NSFW </span>}
                        {post.spoiler && <span style={{ color: 'orange' }}>Spoiler </span>}
                        {post.stickied && <span style={{ color: 'green' }}>Sticky </span>}
                        {is_gallery && <span style={{ color: 'pink' }}>Gallery </span>}
                        <Link to={`/r/${subreddit}`}>/r/{subreddit}</Link>
                        {' | '}
                        <Link to={`/user/${author}`}> u/{author} </Link>
                        <p style={{ margin: '0px 0px 0px 1em', fontStyle: 'italic' }}>{formatDate(created_utc)}</p>
                    </Typography>
                    {crosspost_parent_list && (<Typography variant="body2">Crosspost: 
                    <Link to={`/r/${crosspost_parent_list[0].subreddit}`}>/r/{crosspost_parent_list[0].subreddit}</Link>
                        {' | '}
                        <Link to={`/user/${crosspost_parent_list[0].author}`}> u/{crosspost_parent_list[0].author} </Link>
                    </Typography>)}
                    <Typography variant='subtitle2'>{title}</Typography>
                </CardContent>
                {imagepart && imagepart}
                <CardContent>
                    <Typography variant="body2"><Link target="_blank" to={url}>{domain}</Link></Typography>
                </CardContent>

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