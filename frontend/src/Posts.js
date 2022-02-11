import React, { useEffect, useState } from 'react';
import { PostElement } from './PostElement';
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
            return <PostElement key={element._id} post={element} />
        })
    }

    return(
        <div className='posts '>
            <div className='flex'>
                <h1 className='text-xl mt-4 mb-8 text-blue-700 font-bold'>Fil des posts</h1>
                <button className='ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold rounded h-3/6 p-2'>Ajouter un post</button>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                {posts ? showPosts() : <span>Loading...</span>}
            </div>
        </div>
    );

}