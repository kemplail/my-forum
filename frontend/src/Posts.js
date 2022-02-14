import React, { useEffect, useState } from 'react';
import { PostElement } from './PostElement';
import Title from './Title';
import axios from 'axios';
import AddPostModal from './AddPostModal';

import { PlusSmIcon } from '@heroicons/react/solid';

export function Posts(props) {

    const [posts, setPosts] = useState();
    const [isOpen, setIsOpen] = useState(false);
    
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

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function onAdd(post) {
        setPosts([...posts,post]);
    }

    return(
        <div className='posts '>
            <div className='flex'>
                <Title name="Fil des posts" />
                <button onClick={openModal} className='ml-auto flex bg-blue-500 hover:bg-blue-700 text-white font-bold rounded h-3/6 p-2'><PlusSmIcon className='w-5 h-5'/>Ajouter un post</button>
            </div>
            <div className='grid grid-cols-2 gap-6'>
                {posts ? showPosts() : <span>Loading...</span>}
            </div>

            <AddPostModal open={isOpen} close={closeModal} onAdd={onAdd} />
        </div>
    );

}