import moment from "moment";
import { DateElement } from "../textelements/DateElement";
import { useState } from "react";
import { CommentDescription } from "./CommentDescription";
import { CommentModification } from "./CommentModification";
import { Comment } from "src/types/comment";

interface CommentElementProps {
    comment: Comment
}

export default function CommentElement(props: CommentElementProps) {

    const [isModificationInProgress, setIsModificationInProgress] = useState(false);


    function modifyComment() {
        setIsModificationInProgress(true);
    }

    function stopModifyComment() {
        setIsModificationInProgress(false);
    }

    return(
    <div className="comment-element bg-slate-100 mt-2 p-2 rounded-md shadow">
        <DateElement>
            Ecrit par { props.comment.author.username } le { moment(props.comment.date).format("DD/MM/YYYY") } à { moment(props.comment.date).format("h:mm") }
        </DateElement>
        {isModificationInProgress ? <CommentModification onStopModify={stopModifyComment} comment={props.comment} /> : <CommentDescription comment={props.comment} onModify={modifyComment}  /> }
    </div>
    );

}