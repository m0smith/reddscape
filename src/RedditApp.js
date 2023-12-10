import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RedditBox from './RedditBox';
import RedditLayout from './RedditLayout';

const RedditApp = ({ type, name, default_category }) => {

    const [posts, setPosts] = useState([]);
    // const [subreddit, setSubreddit] = useState('popular'); // Default subreddit
    const [category, setCategory] = useState(default_category); // Default category
    const [includeNSFW, setIncludeNSFW] = useState(false); // NSFW toggle
    const [after, setAfter] = useState(null); // To keep track of pagination
    const [isLoading, setIsLoading] = useState(false); // To manage loading state
    const [loadMore, setLoadMore] = useState(true);
    const [debouncedSubreddit, setDebouncedSubreddit] = useState(name);


    if (name !== debouncedSubreddit) {
        setLoadMore(false)
        setDebouncedSubreddit(name)
        setPosts([]);  // Reset posts
        setAfter(null); // Reset pagination token

        setIsLoading(false)
        setLoadMore(true)
    }

    // console.log(subreddit + ' ' + debouncedSubreddit)

    const debounce = (func, delay) => {
        let inDebounce;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce);
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        };
    };

    function decode(str) {

        let txt = new DOMParser().parseFromString(str, "text/html");

        return txt.documentElement.textContent;

    }

    const handleSubredditChange = debounce((newSubreddit) => {
        setDebouncedSubreddit(newSubreddit);
    }, 500); // 500ms delay

    useEffect(() => {
        console.log("useEffect:" + loadMore + " " + isLoading)
        if (loadMore && !isLoading) {
            setIsLoading(true);
            console.log(type + ' ' + name)
            axios.get(`https://www.reddit.com/${type}/${name}/${category}.json?after=${after}&show=all`)
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
        [debouncedSubreddit, category, includeNSFW, after, loadMore]); // Add includeNSFW as a dependency



    const newSubreddit = (s) => {
        console.log("newSubreddit")
        setLoadMore(false);
        setPosts([]);
        setAfter(null);
        // setSubreddit(_ => s)
        handleSubredditChange(s);
        setIsLoading(false);
        setLoadMore(true);
        // Reset posts
        // Reset pagination token

    };

    const handleNsfw = () => {
        setLoadMore(false);
        setAfter(null);
        setPosts([])
        setIncludeNSFW((f) => !f)
        setIsLoading(false)
        setLoadMore(true);


    }

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

    const default_video = (post) => {
        const full = post.media ? post.media.reddit_video.fallback_url : post.preview.reddit_video_preview.fallback_url
        return [ decode(post.preview.images.slice(-1)[0].resolutions.slice(-1)[0].url),  
            full]
        
    }

    const gif_image = (post) => {
        return [ decode(post.preview.images.slice(-1)[0].resolutions.slice(-1)[0].url),  
            post.url]
        
    }

    const default_image = (post) => {
        return [decode(post.preview.images.slice(-1)[0].resolutions.slice(-1)[0].url),
            decode(post.preview.images.slice(-1)[0].source.url)]
    }

    const default_gallery = (post) => {
        const gallery_id = post.gallery_data ? post.gallery_data.items[0].media_id : null
        if(! gallery_id) {
            console.log(post)
        }
        return [post.thumbnail, gallery_id ? decode(post.media_metadata[gallery_id].s.u) : null]
    }

    return (
        <div className="App">
            {type}
            <input
                type="text"
                value={name}
                onChange={(e) => newSubreddit(e.target.value)}
                placeholder="Enter subreddit"
            />
            <select value={category} onChange={(e) => handleCategory(e.target.value)}>
                <option value="hot">Hot</option>
                <option value="new">New</option>
                <option value="rising">Rising</option>
                <option value="top">Top</option>
                <option value="controversial">Controversial</option>
                <option value="submitted">Submitted</option>

            </select>
            <label>
                Include NSFW
                <input
                    type="checkbox"
                    checked={includeNSFW}
                    onChange={handleNsfw}
                />
            </label>
            <RedditLayout>
                {posts.map(post => {

                    const isVideo = post.is_video || post.preview?.reddit_video_preview
                    //console.log(post.thumbnail, post.is_video)
                    let thumbnail = post.thumbnail.startsWith('http') ? post.thumbnail : null
                    let fullImageUrl = null 
                    if(isVideo) {
                        [thumbnail, fullImageUrl ] = default_video(post)
                    } else if (post.is_reddit_media_domain){
                        [thumbnail, fullImageUrl ] = gif_image(post)
                    }   else if (post.preview) {
                        [thumbnail, fullImageUrl ] = default_image(post)
                    } else if (post.is_gallery) {
                        [thumbnail, fullImageUrl ] = default_gallery(post)
                    }
                    
                    // let thumbnail = post.thumbnail.startsWith('http') ? post.thumbnail : null

                    // if (!thumbnail && post.preview) {
                    //     thumbnail = decodeURI(post.preview.images[0].resolutions[0].url)
                    // }
                    // if (!thumbnail && post.url_overridden_by_dest) {
                    //     thumbnail = post.url_overridden_by_dest
                    // }

                    return <RedditBox
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        author={post.author}
                        url={post.url}
                        domain={post.domain}
                        selftext={post.selftext}
                        thumbnail={thumbnail}
                        fullImageUrl={fullImageUrl}
                        numComments={post.num_comments}
                        permalink={post.permalink}
                        subreddit={post.subreddit}
                        isNSFW={post.over_18}
                        created_utc={post.created_utc}
                        isSpoiler={post.spoiler}
                        isStickied={post.stickied}
                        isVideo={isVideo }
                        crosspostParent={post.crosspost_parent_list ? post.crosspost_parent_list[0] : null}
                    />
                })}
            </RedditLayout>
            {isLoading && <div>Loading more posts...</div>}
        </div>
    );
};

export default RedditApp;
