import React from 'react';

import RedditApp from './RedditApp';

import { useParams } from 'react-router-dom';

const SubredditComponent = () => {
   
    const { subreddit } = useParams();
    return ( 
        <RedditApp type="r" name={subreddit} default_category="hot"/>
    )
}

export default SubredditComponent;
