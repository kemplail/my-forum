import React, { useEffect, useState } from 'react';
import { Post } from './Post';
import axios from 'axios';

export function Posts(props) {

    const [posts, setPosts] = useState();
    
    useEffect(() => {
        async function getPosts() {
            const { data } = await axios.get('http://localhost:5000/posts');
            setPosts(data);
        }
        getPosts();
    },[])

    function showPosts() {
        return posts?.map((element) => {
            return <Post key={element._id} post={element} />
        })
    }

    return(
        <div>
            <h1>Fil des posts</h1>
            {posts ? showPosts() : <span>Loading...</span>}
        </div>
    );

}