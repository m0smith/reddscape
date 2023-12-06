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


    const debounce = (func, delay) => {
        let inDebounce;
        return function() {
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
        if (loadMore && !isLoading) {
            setIsLoading(true);
            console.log(subreddit)
            axios.get(`https://www.reddit.com/r/${subreddit}/${category}.json?after=${after}`)
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
    }, [debouncedSubreddit, category, includeNSFW, after, loadMore]); // Add includeNSFW as a dependency

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

    const loadMorePosts = () => {
        setIsLoading(true); // Set loading to true to prevent multiple requests
        // API call is made in useEffect which listens to changes in `after` state
    };

    const newSubreddit = (s) => {
        console.log("newSubreddit")
        // setSubreddit(_ => s)
        handleSubredditChange(s);
        setIsLoading(false); 
        setLoadMore(true);
        setPosts([]);  // Reset posts
        setAfter(null); // Reset pagination token
        
    };

    const handleNsfw = () => {
        setPosts([])
        setIncludeNSFW((f) => !f)
        setIsLoading(false)
        setLoadMore(true);
    }

    const handleCategory = (v) => {
        setPosts([])
        setIsLoading(false)
        setLoadMore(true);
        setCategory(v)
    }

    useEffect(() => {
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
                {posts.map(post => (
                    <RedditBox
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        author={post.author}
                        url={post.url}
                        thumbnail={post.thumbnail.startsWith('http') ? post.thumbnail : null}
                        fullImageUrl={post.url}
                        numComments={post.num_comments}
                        permalink={post.permalink}
                        subreddit={post.subreddit}
                        isNSFW={post.over_18}
                        created_utc={post.created_utc}
                        isSpoiler={post.spoiler}
                        isStickied={post.stickied}
                        crosspostParent={post.crosspost_parent_list ? post.crosspost_parent_list[0] : null}
                    />
                ))}
            </RedditLayout>
            {isLoading && <div>Loading more posts...</div>}
        </div>
    );
};

export default SubredditComponent;
