import React, { useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';


import { Close, Visibility } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Link } from 'react-router-dom';
import { Box, CardHeader, CardMedia, Chip, Icon } from '@mui/material';
import stringify from 'json-stable-stringify'
import ArbitraryCodeCardContent from './ArbitraryCodeCardContent';
import CardModal from './CardModal';
import { decode, formatDate } from './utils';
import spoiler from './spoiler.png'
import { VisibilityOff, Explicit, PriorityHigh, Collections, Link as LinkIcon } from '@mui/icons-material';




export default function RedditCard({ post, onSubredditClick }) {
    const { url, spoiler, over_18, stickied, subreddit, author, crosspost_parent_list, selftext, selftext_html, created_utc, is_video, preview, thumbnail, title, removed_by_category, is_gallery } = post
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



    const imageContent = ({ thumbnail, thumbnail_height, title, is_self, url, preview, over_18, spoiler, stickied}) => {
        if (is_self) return null

        const preview_images = preview?.images
        const preview_images_source_url = preview_images && preview_images.length > 0 && preview_images[0].source?.url




        const image = thumbnail === "spoiler" ? spoiler :
            thumbnail === "nsfw" ? preview_images_source_url :
                thumbnail === "image" ? url :
                    thumbnail === "default" ? preview_images_source_url : thumbnail

        return image && (
            <Box sx={{
                position: 'relative',
                width: "100%"
            }}>
                <CardMedia
                    onClick={handleOpen}
                    component="img"
                    // width={thumbnail_width}
                    // height={thumbnail_height}
                    width="100%"
                    image={decode(image)}
                    alt={thumbnail}

                    sx={{ objectFit: "contain" }} />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.54)',
                        color: 'white',
                        padding: '10px',
                    }}
                >
                    <Typography variant="body2">{title.substring(0, 50)}</Typography>
                    <Typography variant="subtitle2">
                        {over_18 && <Chip icon={<Explicit sx={{ color: "white", background: "red" }} fontSize="small" />} />}
                        {spoiler && <Chip icon={<VisibilityOff sx={{ color: "white", background: "yellow" }} fontSize="small" />} />}
                        {stickied && <Chip icon={<PriorityHigh sx={{ color: "white", background: "green" }} fontSize="small" />} />}
                        {is_gallery && <Collections sx={{ color: "white" }} fontSize="small" />}
                        <Link target="_blank" to={url} ><LinkIcon sx={{ color: "white" }} fontSize="small" /></Link>
                        <Link style={{ color: "white" }} to={`/r/${subreddit}`}>/r/{subreddit}</Link>
                        {' | '}
                        <Link style={{ color: "white" }} to={`/user/${author}`}>/u/{author}</Link>
                    </Typography>
                    {crosspost_parent_list && (<Typography variant="body2">:
                        <Link style={{ color: "white" }} to={`/r/${crosspost_parent_list[0].subreddit}`}>/r/{crosspost_parent_list[0].subreddit}</Link>
                    </Typography>)}
                </Box>
            </Box>)
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
        padding: '2px',
        margin: '0px',
        width: '100%', // Full width on smaller screens
        maxWidth: '300px', // Fixed max width on larger screens
        overflow: 'hidden'
    };

    return (
        <Box style={boxStyle}>
            <Card>
                {imagepart && imagepart}
                {! imagepart && (
                    <CardContent>

                        <Typography variant="body2">{title}</Typography>
                        <Typography variant="subtitle2">
                            {over_18 && <Chip icon={<Explicit sx={{ color: "red", background: "grey" }} fontSize="small" />} />}
                            {spoiler && <VisibilityOff sx={{ color: "yellow", background: "grey" }} fontSize="small" />}
                            {stickied && <PriorityHigh sx={{ color: "green", background: "grey" }} fontSize="small" />}
                            {is_gallery && <Collections fontSize="small" />}
                            <Link target="_blank" to={url} ><LinkIcon  fontSize="small" /></Link>
                            <Link  to={`/r/${subreddit}`}>/r/{subreddit}</Link>
                            {' | '}
                            <Link to={`/user/${author}`}> u/{author} </Link>
                        </Typography>
                        {crosspost_parent_list && (<Typography variant="body2">:
                            <Link  to={`/r/${crosspost_parent_list[0].subreddit}`}>/r/{crosspost_parent_list[0].subreddit}</Link>
                        </Typography>)}

                    </CardContent>
                )}

                {content && content.length > 0 && <ArbitraryCodeCardContent code={content} snippet_length="100"/>}
                <ArbitraryCodeCardContent code={formatted_post} snippet_length="100" />
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