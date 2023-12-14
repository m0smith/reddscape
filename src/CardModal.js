import * as React from 'react';
import Card from '@mui/material/Card';
import { useState, useEffect } from 'react';

import CardMedia from '@mui/material/CardMedia';
import { Dialog, IconButton, CardContent } from '@mui/material';
import { Close } from '@mui/icons-material';

import { decode } from './utils';

export default function CardModal({ post, open, handleClose }) {
 
    const { is_video, thumbnail, title, is_reddit_media_domain, media, domain, url, preview, post_hint } = post

    const urlDomains = new Set(["i.imgur.com", "imgur.com"])
    const preview_images = preview?.images
    const preview_images_source_url = preview_images && preview_images.length > 0 && preview_images[0].source?.url
    const treatAsVideo = is_video || preview?.reddit_video_preview?.fallback_url || urlDomains.has(domain)

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
        console.log("useeffest")
        if (!primaryImageUrl) {
            setImageUrl(fallbackImageUrl)
        } else {
            fetch(primaryImageUrl, {
                method: 'HEAD', // Only need to check the headers, not the full image
            })
                .then(response => {
                    console.log(response)
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
    }, []); // Empty dependency array to run only once on mount

    console.log("IMGE:" + imageUrl)
    return (<Dialog
        open={open}
        onClose={handleClose}>
        <IconButton sx={{ ml: 'auto' }} onClick={handleClose}>
            <Close />
        </IconButton>
        <Card onClick={handleClose}>
            <CardContent>{title}</CardContent>
            <CardContent>Image: {primaryImageUrl}</CardContent>
            <CardMedia
                component={treatAsVideo ? "video" : "img"}
                autoPlay={treatAsVideo}
                controls={treatAsVideo}
                loop={treatAsVideo}
                muted={treatAsVideo}
                style={{ width: '100%', height: 'auto' }}
                src={imageUrl}
                alt={title}
            />

        </Card>

    </Dialog >)
}
// if (!src) return null;
//   return (
//     <div style={{
//         position: 'fixed', 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         bottom: 0, 
//         backgroundColor: 'rgba(0, 0, 0, 0.8)', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'center', 
//         zIndex: 1000
//     }}>
//     <Card sx={{ maxWidth: '100%' }}>
//       <CardActionArea   onClick={onClose}>
//         <CardMedia
//           component={isVideo? "video": "img"}
//           autoPlay={isVideo}
//           controls={isVideo}
//           image={src}
//           alt={alt}
//         />
//       </CardActionArea>
//       <CardActions>
//         <Button size="small" color="primary">
//           Share
//         </Button>
//       </CardActions>
//     </Card>
//     </div>
//   );
// }