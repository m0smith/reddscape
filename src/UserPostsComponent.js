import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RedditBox from './RedditBox'; // Assuming this is your component to display individual posts

const UserPostsComponent = () => {
    const { username } = useParams();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserPosts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`https://www.reddit.com/user/${username}/submitted.json`);
                const submittedPosts = response.data.data.children
                    .filter(child => child.kind === 't3') // Filter out comments (kind 't1')
                    .map(child => child.data);
                setPosts(submittedPosts);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
            setIsLoading(false);
        };

        fetchUserPosts();
    }, [username]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            {posts.map(post => (
                <RedditBox key={post.id}
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
        </div>
    );
};

export default UserPostsComponent;
