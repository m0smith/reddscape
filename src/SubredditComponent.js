import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RedditBox from './RedditBox';
import RedditLayout from './RedditLayout';
import { useParams } from 'react-router-dom';

const SubredditComponent = () => {
    const { subreddit } = useParams();
    const [posts, setPosts] = useState([]);
    // const [subreddit, setSubreddit] = useState('popular'); // Default subreddit
    const [category, setCategory] = useState('hot'); // Default category
    const [includeNSFW, setIncludeNSFW] = useState(false); // NSFW toggle
    const [after, setAfter] = useState(null); // To keep track of pagination
    const [isLoading, setIsLoading] = useState(false); // To manage loading state
    const [loadMore, setLoadMore] = useState(true);
    const [debouncedSubreddit, setDebouncedSubreddit] = useState(subreddit);

    if (subreddit !== debouncedSubreddit) {
        setLoadMore(false)
        setDebouncedSubreddit(subreddit)
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

    const handleSubredditChange = debounce((newSubreddit) => {
        setDebouncedSubreddit(newSubreddit);
    }, 500); // 500ms delay

    useEffect(() => {
        console.log("useEffect:" + loadMore + " " + isLoading)
        if (loadMore && !isLoading) {
            setIsLoading(true);
            console.log(subreddit)
            axios.get(`https://www.reddit.com/r/${subreddit}/${category}.json?after=${after}&show=all`)
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



    return (
        <div className="App">
            <input
                type="text"
                value={subreddit}
                onChange={(e) => newSubreddit(e.target.value)}
                placeholder="Enter subreddit"
            />
            <select value={category} onChange={(e) => handleCategory(e.target.value)}>
                <option value="hot">Hot</option>
                <option value="new">New</option>
                <option value="rising">Rising</option>
                <option value="top">Top</option>
                <option value="controversial">Controversial</option>
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


                    //console.log(post.thumbnail, post.is_video)
                    let thumbnail = post.thumbnail.startsWith('http') ?  post.thumbnail : null

                    if (!thumbnail && post.preview) {
                        thumbnail = decodeURI(post.preview.images[0].resolutions[0].url)
                    }
                    if (!thumbnail && post.url_overridden_by_dest) {
                        thumbnail =  post.url_overridden_by_dest
                    }
                    if (post.is_video) {
                        thumbnail =  decodeURI(post.media.reddit_video.scrubber_media_url)
                    }
                    return <RedditBox
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        author={post.author}
                        url={post.url}
                        domain={post.domain}
                        selftext={post.selftext}
                        thumbnail={thumbnail}
                        fullImageUrl={post.url}
                        numComments={post.num_comments}
                        permalink={post.permalink}
                        subreddit={post.subreddit}
                        isNSFW={post.over_18}
                        created_utc={post.created_utc}
                        isSpoiler={post.spoiler}
                        isStickied={post.stickied}
                        isVideo={post.is_video}
                        crosspostParent={post.crosspost_parent_list ? post.crosspost_parent_list[0] : null}
                    />
                })}
            </RedditLayout>
            {isLoading && <div>Loading more posts...</div>}
        </div>
    );
};

export default SubredditComponent;