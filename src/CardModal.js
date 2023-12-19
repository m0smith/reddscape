import * as React from 'react';
import Card from '@mui/material/Card';
import { useState, useEffect } from 'react';

import CardMedia from '@mui/material/CardMedia';
import { Dialog, IconButton, CardContent } from '@mui/material';
import { Close } from '@mui/icons-material';

import { decode } from './utils';
import ImageGallery from "react-image-gallery"

export default function CardModal({ post, open, handleClose }) {

    const { is_video, title, is_reddit_media_domain, media, domain, url, preview, is_gallery, gallery_data, media_metadata } = post

    const urlDomains = new Set(["i.imgur.com", "imgur.com"])
    const preview_images = preview?.images
    const preview_images_source_url = preview_images && preview_images.length > 0 && preview_images[0].source?.url
    const treatAsVideo = is_video || preview?.reddit_video_preview?.fallback_url || urlDomains.has(domain)
    let items = is_gallery ? gallery_data.items.map(i => {
        return {
            original: decode(media_metadata[i.media_id].s?.u),
            thumbnail: media_metadata[i.media_id]?.p && decode(media_metadata[i.media_id]?.p[0]?.u),
            originalHeight: media_metadata[i.media_id].s?.y,
            originalWidth: media_metadata[i.media_id].s?.x,
            thumbnailHeight: media_metadata[i.media_id]?.p && media_metadata[i.media_id]?.p[0]?.y,
            thumbnailWidth: media_metadata[i.media_id]?.p && media_metadata[i.media_id]?.p[0]?.x
        }
    }) : null

    let image = null
    // console.log(is_reddit_media_domain + ' ' + media?.reddit_video?.fallback_url)

    if (urlDomains.has(domain)) {
        image = url.replace('.gifv', '.mp4')
        image = /\.\w+$/.test(image) ? image : `${image}.mp4`
    }
    else if (is_reddit_media_domain && media?.reddit_video?.fallback_url) image = media.reddit_video.fallback_url
    else if (is_reddit_media_domain) image = url
    else if (preview?.reddit_video_preview?.fallback_url) image = preview.reddit_video_preview.fallback_url

    const primaryImageUrl = image;
    const fallbackImageUrl = preview?.reddit_video_preview?.fallback_url || media?.reddit_video?.fallback_url || decode(preview_images_source_url) // Replace with your fallback image URL
    const [imageUrl, setImageUrl] = useState(primaryImageUrl);

    useEffect(() => {
        // console.log("useeffest")
        if (!primaryImageUrl) {
            setImageUrl(fallbackImageUrl)
        } else {
            fetch(primaryImageUrl, {
                method: 'HEAD', // Only need to check the headers, not the full image
            })
                .then(response => {
                    // console.log(response)
                    if (response.status === 302) {
                        setImageUrl(fallbackImageUrl);
                    } else if (response.redirected && response.url.endsWith("removed.png")) {
                        setImageUrl(fallbackImageUrl);
                    }
                })
                .catch(() => {
                    setImageUrl(fallbackImageUrl); // Fallback for any other network errors
                });
        }
        // eslint-disable-next-line 
    }, []); // Empty dependency array to run only once on mount
    const boxStyle = {
        border: '1px solid gray',
        padding: '10px',
        margin: '10px',
        width: '100%', // Full width on smaller screens
        //maxWidth: '200px', // Fixed max width on larger screens
        overflow: 'hidden'
    };
    // console.log("IMGE:" + imageUrl)
    return (<Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        //maxWidth="100%"
        style={boxStyle}
    >
        <IconButton sx={{ ml: 'auto' }} onClick={handleClose}>
            <Close />
        </IconButton>
        {is_gallery && <ImageGallery useBrowserFullscreen="false" items={items} thumbnailPosition="top" style={{ width: 'auto', height: 'auto' }} />}
        {!is_gallery && <Card fullWidth
            maxWidth="xl">
            <CardContent>{title}</CardContent>
            <CardContent>Image: {primaryImageUrl}</CardContent>

            <CardMedia
                component={treatAsVideo ? "video" : "img"}
                autoPlay={treatAsVideo}
                controls={treatAsVideo}
                loop={treatAsVideo}
                muted={treatAsVideo}
                style={{ width: '100%', height: '90%' }}
                src={imageUrl}
                alt={title}
            />

        </Card>}

    </Dialog >)
}

