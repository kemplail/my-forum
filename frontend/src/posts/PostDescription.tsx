import Title from '../textelements/Title';
import moment from "moment";
import DeleteElementModal from '../modals/DeleteElementModal';
import { useNavigate } from 'react-router-dom';

import { HeartIcon } from '@heroicons/react/solid';

import { useState } from "react";
import { useAppSelector } from '../hooks';
import { useDeleteLikeOfUserOnPostMutation, useDeletePostMutation, useGetLikeOfUserOnPostQuery } from '../store/rtk/post';
import { UpdateButton } from '../formelements/UpdateButton';
import { DeleteButton } from '../formelements/DeleteButton';
import { DateElement } from 'src/textelements/DateElement';
import { useLoggedUserQuery } from 'src/store/rtk/user';
import { useAddALikePostMutation } from 'src/store/rtk/post';
import { LikeButton } from 'src/formelements/LikeButton';

export default function PostDescription(props : any) {

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const navigate = useNavigate();

    const [ deletePost ] = useDeletePostMutation();

    const accesstoken = useAppSelector((state) => state.user.access_token);

    const { data, error } = useLoggedUserQuery(undefined,{skip: (accesstoken === '')});
    const { data:like, error:errorlike } = useGetLikeOfUserOnPostQuery(props.post._id,{skip: (accesstoken === '')});
    
    const [ addLike ] = useAddALikePostMutation();
    const [ deleteLike ] = useDeleteLikeOfUserOnPostMutation();

    function openModal() {
        setIsDeleteOpen(true);
    }

    function closeModal() {
        setIsDeleteOpen(false);
    }

    async function handleDelete() {
        deletePost(props.post._id);
        closeModal();
        navigate('/posts');
    }

    function addALike() {
        addLike({ post: props.post._id });
    }

    function deleteALike() {
        deleteLike(props.post._id);
    }

    return (
        <div className="post-description p-4 bg-blue-100 mb-4 shadow">

            <div className='flex'>

                <Title>{props.post.title}</Title>

                <div className='block ml-auto space-y-4'>

                { !error && data?._id === props.post.author._id && 
                    
                    <div className='space-x-2 flex'>
                        <UpdateButton onClick={props.onModify} />
                        <DeleteButton onClick={openModal} />
                    </div>

                }

                    <div className='flex space-x-2 float-right'>
                        <span className="text-xl">{props.post.likes.length}</span> <HeartIcon className="h-8 w-8 text-pink-500 " /> <br />
                        { accesstoken ? like ? <LikeButton onClick={deleteALike} value={"Je n'aime plus"} /> : <LikeButton onClick={addALike} value={"J'aime"} /> : ""} 
                    </div>

                </div>

            </div>

            <div className="mb-4">
                <DateElement>Crée {moment(props.post.date).fromNow()} par {props.post.author.username}</DateElement> <br/>
                { props.post.lastUpdate && <DateElement>Modifié pour la dernière fois {moment(props.post.lastUpdate).fromNow()}</DateElement> }
            </div>

            <div className="bg-slate-100 rounded p-4">
                {props.post.text}
            </div>

            <DeleteElementModal open={isDeleteOpen} close={closeModal} name={`Supprimer "${props.post.title}"`} deleteFunc={handleDelete} />
        </div>
    );
}