import { UpdateButton } from "../formelements/UpdateButton";
import { DeleteButton } from "../formelements/DeleteButton";
import { useState } from "react";
import DeleteElementModal from "src/modals/DeleteElementModal";
import { useDeleteCommentMutation } from "src/store/rtk/comments";
import { Comment } from "src/types/comment";

interface CommentDescriptionProps {
    comment: Comment,
    onModify: VoidFunction
}

export function CommentDescription(props: CommentDescriptionProps) {

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [ deleteComment ] = useDeleteCommentMutation();

    function handleDelete() {
        deleteComment(props.comment._id);
        closeModal();
    }

    function closeModal() {
        setIsDeleteOpen(false);
    }

    function openModal() {
        setIsDeleteOpen(true);
    }

    return (
        <div className="grid grid-cols-6 mt-2 gap-2">
            <div className="break-words col-span-4">
                { props.comment.text }
            </div>

            <div className="ml-auto flex space-x-2 col-span-2"><UpdateButton onClick={props.onModify} /><DeleteButton onClick={openModal} /></div>

            <DeleteElementModal open={isDeleteOpen} close={closeModal} name={"Supprimer le commentaire"} deleteFunc={handleDelete} />
        </div>
    );
}