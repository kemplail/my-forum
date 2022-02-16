import Title from '../textelements/Title';
import moment from "moment";
import DeleteElementModal from '../modals/DeleteElementModal';
import { useNavigate } from 'react-router-dom';

import { useState } from "react";
import { deleteAPost } from '../store/slices/post';
import { useAppDispatch } from '../hooks';
import { useDeletePostMutation } from '../store/rtk/post';
import { UpdateButton } from '../formelements/UpdateButton';
import { DeleteButton } from '../formelements/DeleteButton';
import { DateElement } from 'src/textelements/DateElement';

export default function PostDescription(props : any) {

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const navigate = useNavigate();

    const [ deletePost ] = useDeletePostMutation();

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

    return (
        <div className="post-description p-4 bg-blue-100 mb-4 shadow">

            <Title>{props.post.title}</Title>

            <div className="flex mb-4">
                <div>
                    <DateElement>Crée {moment(props.post.date).fromNow()} par {props.post.author.username}</DateElement> <br/>
                    { props.post.lastUpdate && <DateElement>Modifié pour la dernière fois {moment(props.post.lastUpdate).fromNow()}</DateElement> }
                </div>
                <div className="ml-auto flex space-x-2">
                    <UpdateButton onClick={props.onModify} />
                    <DeleteButton onClick={openModal} />
                </div>
            </div>

            <div className="bg-slate-100 rounded p-4">
                {props.post.text}
            </div>

            <DeleteElementModal open={isDeleteOpen} close={closeModal} name={`Supprimer "${props.post.title}"`} deleteFunc={handleDelete} />
        </div>
    );
}