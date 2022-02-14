import { useEffect, useState } from "react";
import AddComment from "./AddComment";
import CommentsList from "./CommentsList";
import axios from 'axios';

export default function Comments(props) {
    
    const [comments, setComments] = useState();

    function addComment(comment) {
        const newComments = [...comments,comment];
        setComments(newComments);
    }

    useEffect(() => {
        async function getCommentsOfAPost(id) {
          const { data } = await axios.get(`http://localhost:5000/comments/post/${id}`);
          setComments(data);
        }
        getCommentsOfAPost(props.postid);
    },[])

    function showComments() {
        return(
            <div className='comments-childlist bg-blue-100 p-4 shadow'>
                <AddComment postid={props.postid} onAdd={addComment} />
                <CommentsList comments={comments} />
            </div>
        );
    }

    return(<div className="comments-parentlist">{ comments ? showComments() : "Loading..."}</div>);

}