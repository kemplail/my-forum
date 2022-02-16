import { useState } from "react";
import { useParams } from "react-router";
import PostDescription from "./PostDescription";
import Comments from "../comments/Comments";
import { PostModification } from "./PostModification";
import { useGetAPostQuery } from "../store/rtk/post";
import { Post } from "src/types/post";

type ParamTypes = {
    id: string
}

export function DetailedPost() {

    const { id } = useParams<ParamTypes>() as ParamTypes;

    const [isModificationInProgress, setIsModificationInProgress] = useState(false);

    function modifyPost() {
        setIsModificationInProgress(true);
    }

    function stopModifyPost() {
        setIsModificationInProgress(false);
    }

    const { data, isLoading, error } = useGetAPostQuery(id);

    function showDetailedPost(data : Post) {
        return (<div className="bg-blue-200 p-6 rounded-md shadow">
          
            { isModificationInProgress ? <PostModification post={data} stopModify={stopModifyPost} /> : <PostDescription post={data} onModify={modifyPost} /> }
            { id && <Comments postid={id} /> }

            </div>);
    }

    return(<div className="detailedpost" id={id}>
        { !isLoading && data ? 
        showDetailedPost(data)
        : "Loading..." }
    </div>);

}