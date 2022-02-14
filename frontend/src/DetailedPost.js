import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostDescription from "./PostDescription";
import axios from 'axios';
import Comments from "./Comments";

export function DetailedPost(props) {

    const { id } = useParams();
    const [ post, setPost ] = useState();

    useEffect(() => {
        async function getAPost(id) {
            const { data } = await axios.get(`http://localhost:5000/posts/${id}`);
            setPost(data);
        }
        getAPost(id);
    },[]);

    function showDetailedPost() {
        return (<div className="bg-blue-200 p-6 rounded-md shadow">
            <PostDescription post={post} /> 
            <Comments postid={id} />
            </div>);
    }

    return(<div className="detailedpost" id={id}>
        { post ? 
        showDetailedPost()
        : "Loading..." }
    </div>);

}