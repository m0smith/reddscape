import Card from '@mui/material/Card';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { Close } from '@mui/icons-material';
import { CardContent, Dialog, DialogContent, IconButton, Paper, Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import Carousel from 'react-material-ui-carousel';
import { decode } from '../utils';
import './CardModal.css';

// const customNavButtonStyles = {
//     position: 'absolute', // Change from 'static' to 'absolute'
//     top: '30%', // Adjust vertically
//     transform: 'translateY(-50%)', // Center vertically
//     // Additional styling as needed
// };

export default function CardModal({ post, open, handleClose }) {

    const { is_video, title, is_reddit_media_domain, media, domain, url, preview, is_gallery, gallery_data, media_metadata, id } = post

    const urlDomains = new Set(["i.imgur.com", "imgur.com"])
    const preview_images = preview?.images
    const preview_images_source_url = preview_images && preview_images.length > 0 && preview_images[0].source?.url
    const treatAsVideo = is_video || preview?.reddit_video_preview?.fallback_url || urlDomains.has(domain)
    let items = is_gallery ? gallery_data.items.map(i => {
        return {
            original: decode(media_metadata[i.media_id].s?.u),
            thumbnail: media_metadata[i.media_id]?.p && decode(media_metadata[i.media_id]?.p[0]?.u),
            originalHeight: 'auto', //media_metadata[i.media_id].s?.y,
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
        padding: '1px',
        margin: '1px',
        width: '100%', // Full width on smaller screens
        //maxWidth: '200px', // Fixed max width on larger screens

        overflow: 'auto'
    };
    // console.log("IMGE:" + imageUrl)
    return (<Dialog
        open={open}
        onClose={handleClose}
        style={boxStyle}
        fullWidth
        maxWidth="xl" // Set the maximum width
        PaperProps={{
            style: {
                width: '98%',
                height: '98%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
        }}
    >
        <DialogContent style={{ width: '100%', height: '100%' }}>
            <IconButton sx={{ ml: 'auto' }} onClick={handleClose}>
                <Close />
            </IconButton>
            <Card
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}
            >

                <CardContent>
                    <Typography variant="body2">{title}</Typography>
                    <Typography variant="body2">Image: {primaryImageUrl}</Typography>
                </CardContent>

                {is_gallery ?
                    <Carousel
                        className={`gallery-${id}`}
                        animation="slide"
                        autoPlay={false}
                        navButtonsAlwaysVisible={true}
                        sx={{
                            width: "90%"
                        }}
                        // navButtonsProps={{ 
                        //     style: customNavButtonStyles 
                        // }}
                    
                        >
                        {
                            items.map((item, i) => {
                                console.log(item)
                                return (
                                    // <img
                                        
                                    //     src={item.original}
                                    //     alt={`Carousel item ${i}`}
                                    //     style={{
                                    //         maxHeight: '100%',
                                    //         maxWidth: '100%',
                                    //         objectFit: 'contain',
                                    //     }}
                                    //     // onClick={() => handleImageClick(image)}
                                    // />
                                <Paper
                                    key={i}
                                    elevation={10}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        // height: 'auto',
                                        maxidth: '100%',
                                        // height: 500
                                        // width: item.originalWidth
                                    }}
                                >

                                    <img
                                        src={item.original}
                                        alt={`Carousel item ${i}`}
                                        style={{
                                            maxHeight: '100%',
                                            maxWidth: '100%',
                                            objectFit: 'contain',
                                        }}
                                        // onClick={() => handleImageClick(image)}
                                    />
                                </Paper>
                                )
                                // return <img width={item.originalWidth} height={item.originalHeight} key={i} src={} alt="hamster" />
                            })
                            // items.map( (item, i) => <Item key={i} item={item} /> )
                        }
                    </Carousel>
                    // <ImageGallery useBrowserFullscreen="false"
                    //     items={items}
                    //     thumbnailPosition="top"
                    //     style={{ display: 'flex', width: 'auto', height: 'auto', margin: 'auto', overflow: 'auto' }} />
                    :

                    <>


                        <CardMedia
                            component={treatAsVideo ? "video" : "img"}
                            autoPlay={treatAsVideo}
                            controls={treatAsVideo}
                            loop={treatAsVideo}
                            muted={treatAsVideo}
                            style={{ width: 'auto', maxWidth: '100%', maxHeight: '80vh', margin: 'auto' }}
                            src={imageUrl}
                            alt={title}
                        />
                    </>}

            </Card>
        </DialogContent>
    </Dialog >)
}

// function Item({item}) {
//     return (
//         <Paper>
//             <img alt="hamster" src={item.original}/>
//         </Paper>
//     )
// }

