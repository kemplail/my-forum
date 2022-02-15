import Title from './Title';
import moment from "moment";
import DeleteElementModal from './DeleteElementModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { PencilIcon } from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { deleteAPost } from './store/slices/post';
import { useAppDispatch } from './hooks';

export default function PostDescription(props : any) {

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    function openModal() {
        setIsDeleteOpen(true);
    }

    function closeModal() {
        setIsDeleteOpen(false);
    }

    async function handleDelete() {
        dispatch(deleteAPost(props.post._id));
        closeModal();
        navigate('/posts');
    }

    return (
        <div className="post-description p-4 bg-blue-100 mb-4 shadow">
            <Title name={props.post.title} />
            <div className="flex mb-4">
                <div>
                    <span className='italic'>Crée {moment(props.post.date).fromNow()} par {props.post.author.username}</span> <br/>
                    { props.post.lastUpdate && <span>Modifié pour la dernière fois {moment(props.post.lastUpdate).fromNow()}</span> }
                </div>
                <div className="ml-auto flex space-x-2">
                    <button onClick={props.onModify} className='ml-auto flex bg-green-500 hover:bg-green-700 text-white font-bold rounded h-10 p-2'><PencilIcon className="h-5 w-5" /><span>Modifier</span></button>
                    <button onClick={openModal} className='ml-auto flex bg-red-500 hover:bg-red-700 text-white font-bold rounded h-10 p-2'><TrashIcon className="h-5 w-5" /><span>Supprimer</span></button>
                </div>
            </div>

            <div className="bg-slate-100 rounded p-4">
                {props.post.text}
            </div>

            <DeleteElementModal open={isDeleteOpen} close={closeModal} name={props.post.title} deleteFunc={handleDelete} />
        </div>
    );
}