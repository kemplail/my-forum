import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostDescription from "./PostDescription";
import axios from 'axios';
import Comments from "./Comments";
import { PostModification } from "./PostModification";
import { useAppSelector } from "./hooks";
import { selectArticleById, selectByPostId, selectPostById } from "./store/slices/post";

export function DetailedPost(props) {

    const { id } = useParams();

    const [isModificationInProgress, setIsModificationInProgress] = useState(false);

    function modifyPost() {
        setIsModificationInProgress(true);
    }

    function stopModifyPost() {
        setIsModificationInProgress(false);
    }

    const post = useAppSelector((state) => selectByPostId(state, id));

    function showDetailedPost() {
        return (<div className="bg-blue-200 p-6 rounded-md shadow">
            { isModificationInProgress ? <PostModification post={post} stopModify={stopModifyPost} /> : <PostDescription post={post} onModify={modifyPost} /> }
            <Comments postid={id} />
            </div>);
    }

    return(<div className="detailedpost" id={id}>
        { post ? 
        showDetailedPost()
        : "Loading..." }
    </div>);

}