import { useState } from 'react';
import { PostElement } from './PostElement';
import Title from '../textelements/Title';
import AddPostModal from '../modals/AddPostModal';
import { Post } from '../types/post';
import { useGetAllPostsQuery } from '../store/rtk/post';

import { PlusSmIcon } from '@heroicons/react/solid';
import { useAppSelector } from 'src/hooks';

export function Posts(props: any) {

    console.log(props.location);

    const [isOpen, setIsOpen] = useState(false);
    const { data, isLoading, error } = useGetAllPostsQuery();

    const accesstoken = useAppSelector((state) => state.user.access_token);

    function showPosts() {
        return data?.map((element: Post) => {
            return <PostElement key={element._id} post={element} />
        })
    }

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return(
        <div className='posts '>
            <div className='flex'>
                <Title>Fil des posts</Title>

                { accesstoken && <button onClick={openModal} className='ml-auto flex bg-blue-500 hover:bg-blue-700 text-white font-bold rounded h-10 p-2'><PlusSmIcon className='w-5 h-5'/>Ajouter un post</button> }
                
            </div>
            <div className='grid grid-cols-2 gap-2'>
                {!isLoading ? showPosts() : <span>Loading...</span>}
            </div>

            <AddPostModal open={isOpen} close={closeModal} />
        </div>
    );

}