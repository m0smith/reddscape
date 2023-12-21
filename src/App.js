import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SubredditComponent from './components/SubredditComponent'; // Import your subreddit component
import UserPostsComponent from './components/UserPostsComponent';
 
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate replace to="/r/popular" />} />

                <Route path="/r/:subreddit" element={<SubredditComponent />} />
                <Route path="/user/:username" element={<UserPostsComponent />} />
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;
