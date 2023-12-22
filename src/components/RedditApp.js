import { Settings } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import RedditCard from './RedditCard';
import RedditLayout from './RedditLayout';
import SettingsModal from '../SettingsModal';
import { AppBar, Button, FormControl, InputLabel, MenuItem, Select, TextField, Toolbar } from '@mui/material';
import logo from '../assets/reddscape-logo.png'
import SubredditInput from './SubredditInput';
import { useNavigate } from 'react-router-dom';

const RedditApp = ({ type, name, default_category }) => {

    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    // const [subreddit, setSubreddit] = useState('popular'); // Default subreddit
    const [category, setCategory] = useState(default_category); // Default category
    const [_type, setType] = useState(type)
    const [after, setAfter] = useState(null); // To keep track of pagination
    const [isLoading, setIsLoading] = useState(false); // To manage loading state
    const [loadMore, setLoadMore] = useState(true);
    const [debouncedSubreddit, setDebouncedSubreddit] = useState(name);
    const [openSettings, setOpenSettings] = React.useState(false);
    const [settings, setSettings] = useState({ nsfw: false })


    const includeNSFW = settings.nsfw

    useEffect(() => {
        console.log("useEffect:" + loadMore + " " + isLoading)
        if (loadMore && !isLoading) {
            setIsLoading(true);
            console.log("Loading: " + _type + ' ' + debouncedSubreddit)
            axios.get(`https://www.reddit.com/${_type}/${debouncedSubreddit}/${category}.json?after=${after}&show=all`)
                .then(response => {
                    const newPosts = response.data.data.children
                        .map(obj => obj.data)
                        .filter(post => includeNSFW || !post.over_18); // Filter based on NSFW setting
                    setPosts(prevPosts => [...prevPosts, ...newPosts]);
                    setAfter(response.data.data.after);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setIsLoading(false);
                }).finally(() => {
                    setLoadMore(false); // Reset loadMore flag
                });
        }
    },
        // eslint-disable-next-line 
        [debouncedSubreddit, _type, category, settings, after, loadMore]); // Add includeNSFW as a dependency



    const newSubreddit = (t, s) => {
        setLoadMore(false);
        setPosts([]);
        setAfter(null);
        setDebouncedSubreddit(s)
        setType(t)
        setIsLoading(false);
        setLoadMore(true);
        navigate(`/${t}/${s}`, { replace: true });
    };

    // const handleNsfw = () => {
    //     setLoadMore(false);
    //     setAfter(null);
    //     setPosts([])
    //     setIncludeNSFW((f) => !f)
    //     setIsLoading(false)
    //     setLoadMore(true)

    // }

    const handleCategory = (v) => {
        setLoadMore(false);
        setPosts([])
        setAfter(null);
        setCategory(v)
        setIsLoading(false)
        setLoadMore(true);

    }

    useEffect(() => {
        const handleScroll = () => {
            // console.log("handleScroll")
            const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
            const threshold = document.documentElement.offsetHeight - 100; // Adjust as needed
            // console.log("handleScroll:scrollPosition:" + scrollPosition)
            // console.log("handleScroll:threshold:" + threshold)
            // console.log("handleScroll:isLoading:" + isLoading)

            if (scrollPosition >= threshold && !isLoading) {
                // console.log("handleScroll:loadMore:" + loadMore)
                setLoadMore(true);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading]); // `isLoading` is a dependency here

    // const default_video = (post) => {
    //     const full = post.media ? post.media.reddit_video?.fallback_url : post.preview.reddit_video_preview.fallback_url
    //     return [post.preview ? decode(post.preview.images.slice(-1)[0].resolutions.slice(-1)[0].url) : full,
    //         full]

    // }

    // const gif_image = (post) => {
    //     const thumbnail = post.preview?.images ? decode(post.preview.images.slice(-1)[0].resolutions.slice(-1)[0].url) : post.url
    //     return [thumbnail,
    //         post.url]

    // }

    // const default_image = (post) => {
    //     return [decode(post.preview.images.slice(-1)[0].resolutions.slice(-1)[0]?.url),
    //     decode(post.preview.images.slice(-1)[0].source?.url)]
    // }

    // const default_gallery = (post) => {
    //     const gallery_id = post.gallery_data ? post.gallery_data.items[0].media_id : null
    //     if (!gallery_id) {
    //         console.log(post)
    //     }
    //     return [post.thumbnail, gallery_id ? decode(post.media_metadata[gallery_id].s?.u) : null]
    // }


    const handleCloseSettings = (newSettings) => {
        setLoadMore(false);
        console.log("close settings")
        console.log(newSettings)
        setOpenSettings(false);
        setAfter(null);
        setPosts([])
        setSettings(newSettings)
        setIsLoading(false)
        setLoadMore(true)
    }

    const handleOpenSettings = () => {
        console.log("open")
        setOpenSettings(true);
    }


    const appBarStyle = {
        background: 'linear-gradient(to top, #ff7e5f, #feb47b)', // Sunset gradient
        top: 0,
        zIndex: 1100
    };


    return (
        <>
            <AppBar className="App" position="fixed" style={appBarStyle}>
                <Toolbar size="small">
                    <img src={logo} alt="Logo" style={{ marginRight: 10 }} height={50} />

                    <SubredditInput type={_type} name={debouncedSubreddit} newSubreddit={newSubreddit} />

                    <FormControl size="small">
                        <InputLabel id="demo-simple-select-label">Order</InputLabel>
                        <Select size="small" value={category} label="Order" onChange={(e) => handleCategory(e.target.value)}>
                            <MenuItem value="hot">Hot</MenuItem>
                            <MenuItem value="new">New</MenuItem>
                            <MenuItem value="rising">Rising</MenuItem>
                            <MenuItem value="top">Top</MenuItem>
                            <MenuItem value="controversial">Controversial</MenuItem>
                            <MenuItem value="submitted">Submitted</MenuItem>

                        </Select>
                    </FormControl>

                    <Settings onClick={handleOpenSettings} />
                    <SettingsModal settings={settings} handleClose={handleCloseSettings} open={openSettings} />
                </Toolbar>
            </AppBar >
            <RedditLayout>
                {posts.map(post => {
                    return (<RedditCard post={post}></RedditCard>)
                })}
            </RedditLayout>
            {isLoading && <div>Loading more posts...</div>}
        </>
    );
};

export default RedditApp;
