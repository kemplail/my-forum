import { UpdateButton } from "../formelements/UpdateButton";
import { DeleteButton } from "../formelements/DeleteButton";
import { useState } from "react";
import DeleteElementModal from "src/modals/DeleteElementModal";
import { useAddALikeMutation, useDeleteCommentMutation, useDeleteLikeOfUserOnCommentMutation, useGetLikeOfUserOnCommentQuery } from "src/store/rtk/comments";
import { Comment } from "src/types/comment";
import { useAppSelector } from "src/hooks";
import { useLoggedUserQuery } from "src/store/rtk/user";
import { DateElement } from "src/textelements/DateElement";
import moment from "moment";
import { HeartIcon } from "@heroicons/react/solid";
import { LikeButton } from "src/formelements/LikeButton";

interface CommentDescriptionProps {
    comment: Comment,
    onModify: VoidFunction
}

export function CommentDescription(props: CommentDescriptionProps) {

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [deleteComment] = useDeleteCommentMutation();

    const accesstoken = useAppSelector((state) => state.user.access_token);
    const { data: like, error: errorlike } = useGetLikeOfUserOnCommentQuery(props.comment._id);
    const [addLike] = useAddALikeMutation();
    const [deleteLike] = useDeleteLikeOfUserOnCommentMutation();
    const { data, error } = useLoggedUserQuery(undefined, { skip: (accesstoken === '') });

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

    function addALike() {
        addLike({ comment: props.comment._id });
    }

    function deleteALike() {
        deleteLike(props.comment._id);
    }

    return (
        <div>

            <div className="mt-2 grid grid-cols-2">

                <div className="p-2 space-y-2">

                    <DateElement>
                        Ecrit par {props.comment.author.username} le {moment(props.comment.date).format("DD/MM/YYYY")} à {moment(props.comment.date).format("h:mm")}
                    </DateElement>

                    <div className="break-words col-span-4">
                        {props.comment.text}
                    </div>

                </div>

                <div className='space-y-4'>

                    {!error && data?._id == props.comment.author._id &&

                        <div className="ml-auto flex space-x-2 col-span-2">
                            <UpdateButton onClick={props.onModify} />
                            <DeleteButton onClick={openModal} />
                        </div>

                    }

                    <div className='flex space-x-2 float-right'>
                        <span className="text-xl">{props.comment.likes.length}</span> <HeartIcon className="h-8 w-8 text-pink-500 " /> <br />
                        {accesstoken ? like ? <LikeButton onClick={deleteALike} value={"Je n'aime plus"} /> : <LikeButton onClick={addALike} value={"J'aime"} /> : ""}
                    </div>

                </div>

            </div>

            <DeleteElementModal open={isDeleteOpen} close={closeModal} name={"Supprimer le commentaire"} deleteFunc={handleDelete} />

        </div>
    );
}