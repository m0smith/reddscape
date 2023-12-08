import React from 'react';
import { useParams } from 'react-router-dom';
import RedditApp from './RedditApp'; // Assuming this is your component to display individual posts


const UserPostsComponent = () => {
    const { username } = useParams();
    return (
        <RedditApp type="user" name={username} passed_category="submitted" />
    )
}

export default UserPostsComponent;




