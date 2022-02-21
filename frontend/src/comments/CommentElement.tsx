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

        {isModificationInProgress ? <CommentModification onStopModify={stopModifyComment} comment={props.comment} /> : <CommentDescription comment={props.comment} onModify={modifyComment}  /> }
    
    </div>
    );

}